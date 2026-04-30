const { prisma } = require('../../config/db');

const LEAVE_LIMITS = {
  vacation: 6,
  sick: 2,
};

const ACTIVE_STATUSES = ['approved', 'pending'];

const toIsoDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  return date.toISOString().split('T')[0];
};

const getMonthBounds = (referenceDate = new Date()) => {
  const current = new Date(referenceDate);
  const start = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), 1));
  const end = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() + 1, 0));

  return {
    start,
    end,
    startIso: start.toISOString().split('T')[0],
    endIso: end.toISOString().split('T')[0],
  };
};

const addDays = (dateString, days) => {
  const date = new Date(`${dateString}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split('T')[0];
};

const buildLeaveBalance = (requests) => {
  const usage = {
    vacation: 0,
    sick: 0,
  };

  for (const request of requests) {
    const type = String(request.leave_type || '').toLowerCase();
    const status = String(request.status || '').toLowerCase();

    if (!ACTIVE_STATUSES.includes(status) || !Object.prototype.hasOwnProperty.call(usage, type)) {
      continue;
    }

    usage[type] += 1;
  }

  return {
    vacation: {
      total: LEAVE_LIMITS.vacation,
      used: usage.vacation,
      remaining: Math.max(LEAVE_LIMITS.vacation - usage.vacation, 0),
    },
    sick: {
      total: LEAVE_LIMITS.sick,
      used: usage.sick,
      remaining: Math.max(LEAVE_LIMITS.sick - usage.sick, 0),
    },
  };
};

class LeavesService {
  async getDashboard(userId, selectedDate) {
    const monthBounds = getMonthBounds();
    const fallbackDate = new Date().toISOString().split('T')[0];
    const normalizedDate = selectedDate || fallbackDate;
    const normalizedIsoDate = toIsoDate(normalizedDate);

    if (normalizedIsoDate < monthBounds.startIso || normalizedIsoDate > monthBounds.endIso) {
      throw new Error('Selected date must be within the current month');
    }

    const userRequests = await prisma.leave_requests.findMany({
      where: {
        user_id: userId,
        leave_date: {
          gte: monthBounds.start,
          lte: monthBounds.end,
        },
      },
      orderBy: {
        leave_date: 'asc',
      },
    });

    const nextDateIso = addDays(normalizedIsoDate, 1);
    const colleagues = await prisma.leave_requests.findMany({
      where: {
        user_id: { not: userId },
        status: { in: ACTIVE_STATUSES },
        leave_date: {
          in: [new Date(`${normalizedIsoDate}T00:00:00.000Z`), new Date(`${nextDateIso}T00:00:00.000Z`)],
        },
        users: {
          is: {
            role: 'employee',
          },
        },
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            job_title: true,
            department: true,
          },
        },
      },
      orderBy: [
        { leave_date: 'asc' },
        { users: { name: 'asc' } },
      ],
    });

    const groupedColleagues = {
      today: colleagues
        .filter((entry) => toIsoDate(entry.leave_date) === normalizedIsoDate)
        .map((entry) => ({
          id: entry.id,
          leaveType: entry.leave_type,
          status: entry.status,
          leaveDate: toIsoDate(entry.leave_date),
          employee: entry.users,
        })),
      tomorrow: colleagues
        .filter((entry) => toIsoDate(entry.leave_date) === nextDateIso)
        .map((entry) => ({
          id: entry.id,
          leaveType: entry.leave_type,
          status: entry.status,
          leaveDate: toIsoDate(entry.leave_date),
          employee: entry.users,
        })),
    };

    return {
      month: {
        startDate: monthBounds.startIso,
        endDate: monthBounds.endIso,
      },
      selectedDate: normalizedIsoDate,
      allowances: buildLeaveBalance(userRequests),
      requests: userRequests.map((request) => ({
        id: request.id,
        leaveType: request.leave_type,
        leaveDate: toIsoDate(request.leave_date),
        reason: request.reason,
        status: request.status,
        createdAt: request.created_at,
      })),
      colleaguesOnLeave: groupedColleagues,
    };
  }

  async applyLeave(userId, payload) {
    const leaveType = String(payload.leaveType || '').toLowerCase();
    const leaveDateIso = toIsoDate(payload.leaveDate);
    const monthBounds = getMonthBounds();

    if (!Object.prototype.hasOwnProperty.call(LEAVE_LIMITS, leaveType)) {
      throw new Error('Leave type must be either vacation or sick');
    }

    if (leaveDateIso < monthBounds.startIso || leaveDateIso > monthBounds.endIso) {
      throw new Error('Leave date must be within the current month');
    }

    const existingRequest = await prisma.leave_requests.findFirst({
      where: {
        user_id: userId,
        leave_date: new Date(`${leaveDateIso}T00:00:00.000Z`),
        status: { in: ACTIVE_STATUSES },
      },
    });

    if (existingRequest) {
      throw new Error('You have already applied for leave on this date');
    }

    const monthlyUsage = await prisma.leave_requests.count({
      where: {
        user_id: userId,
        leave_type: leaveType,
        status: { in: ACTIVE_STATUSES },
        leave_date: {
          gte: monthBounds.start,
          lte: monthBounds.end,
        },
      },
    });

    if (monthlyUsage >= LEAVE_LIMITS[leaveType]) {
      throw new Error(`No ${leaveType} leaves left for this month`);
    }

    const request = await prisma.leave_requests.create({
      data: {
        user_id: userId,
        leave_date: new Date(`${leaveDateIso}T00:00:00.000Z`),
        leave_type: leaveType,
        reason: payload.reason?.trim() || null,
        status: 'approved',
      },
    });

    const dashboard = await this.getDashboard(userId, leaveDateIso);

    return {
      request: {
        id: request.id,
        leaveType: request.leave_type,
        leaveDate: leaveDateIso,
        reason: request.reason,
        status: request.status,
      },
      summary: dashboard,
    };
  }
}

module.exports = new LeavesService();
