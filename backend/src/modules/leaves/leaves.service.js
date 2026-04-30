const { prisma } = require('../../config/db');

const LEAVE_LIMITS = {
  vacation: 6,
  sick: 2,
};

const ACTIVE_STATUSES = ['approved', 'pending'];

const parseDate = (value) => {
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    if (value.includes('T')) return new Date(value);
    const parts = value.split('-');
    if (parts.length === 3) {
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    }
  }
  return new Date(value);
};

const toIsoDate = (value) => {
  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const getMonthBounds = (referenceDate = new Date()) => {
  const current = parseDate(referenceDate);
  const year = current.getFullYear();
  const month = current.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);

  const pad = (n) => String(n).padStart(2, '0');
  const toLocalDateString = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  return {
    start,
    end,
    startIso: toLocalDateString(start),
    endIso: toLocalDateString(end),
  };
};

const addDays = (dateString, days) => {
  const date = parseDate(dateString);
  date.setDate(date.getDate() + days);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
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
    const pad = (n) => String(n).padStart(2, '0');
    const now = new Date();
    const fallbackDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    
    // Handle cases where selectedDate might be "undefined" or "null" as strings
    let normalizedDate = selectedDate;
    if (!selectedDate || selectedDate === 'undefined' || selectedDate === 'null') {
      normalizedDate = fallbackDate;
    }
    
    const normalizedIsoDate = toIsoDate(normalizedDate);
    
    // Calculate bounds based on the selected date. 
    // This effectively allows viewing any month's dashboard by passing a date from that month,
    // while defaulting to the current month.
    const monthBounds = getMonthBounds(normalizedIsoDate);

    // We removed the strict "current month" check here to prevent timezone-related 
    // blocking errors, especially during month transitions.
    
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
          in: [parseDate(normalizedIsoDate), parseDate(nextDateIso)],
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
    const monthBounds = getMonthBounds(leaveDateIso);

    if (!Object.prototype.hasOwnProperty.call(LEAVE_LIMITS, leaveType)) {
      throw new Error('Leave type must be either vacation or sick');
    }

    const existingRequest = await prisma.leave_requests.findFirst({
      where: {
        user_id: userId,
        leave_date: parseDate(leaveDateIso),
      },
    });

    if (existingRequest) {
      throw new Error('You already have a leave request for this date');
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
        leave_date: parseDate(leaveDateIso),
        leave_type: leaveType,
        reason: payload.reason?.trim() || null,
        status: 'pending',
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

  async deleteLeave(leaveId, userId) {
    try {
      const user = await prisma.users.findUnique({ where: { id: userId } });
      const leave = await prisma.leave_requests.findUnique({
        where: { id: parseInt(leaveId) },
      });

      if (!leave) {
        throw new Error('Leave request not found');
      }

      // Only creator, supervisor, or hr can delete leave
      if (leave.user_id !== userId && user.role !== 'supervisor' && user.role !== 'hr') {
        throw new Error('You do not have permission to delete this leave request');
      }

      await prisma.leave_requests.delete({
        where: { id: parseInt(leaveId) },
      });

      return { message: 'Leave request deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new LeavesService();
