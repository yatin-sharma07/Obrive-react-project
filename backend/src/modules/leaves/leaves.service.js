const { prisma } = require('../../config/db');

const LEAVE_LIMITS = { vacation: 6, sick: 2 };
const ACTIVE_STATUSES = ['approved', 'pending'];

class LeavesService {
  // Helper to calculate total days in a range (inclusive)
  calculateDays(start, end) {
    const s = new Date(start);
    const e = new Date(end);
    return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
  }

  async getDashboard(userId, selectedDate) {
    const referenceDate = selectedDate && selectedDate !== 'undefined' ? new Date(selectedDate) : new Date();
    
    // Get month bounds
    const startOfMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
    const endOfMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);

    // Fetch leaves that overlap with the current month
    const userRequests = await prisma.leaves.findMany({
      where: {
        user_id: userId,
        OR: [
          { start_date: { lte: endOfMonth }, end_date: { gte: startOfMonth } }
        ]
      },
      orderBy: { start_date: 'asc' },
    });

    // Calculate Balance (Logic: Sum days of approved/pending requests in this month)
    const usage = { vacation: 0, sick: 0 };
    userRequests.forEach(req => {
      const type = req.leave_type.toLowerCase().includes('sick') ? 'sick' : 'vacation';
      if (ACTIVE_STATUSES.includes(req.status) && usage[type] !== undefined) {
        usage[type] += this.calculateDays(req.start_date, req.end_date);
      }
    });

    return {
      selectedDate: referenceDate.toISOString().split('T')[0],
      allowances: {
        vacation: { total: LEAVE_LIMITS.vacation, used: usage.vacation, remaining: Math.max(LEAVE_LIMITS.vacation - usage.vacation, 0) },
        sick: { total: LEAVE_LIMITS.sick, used: usage.sick, remaining: Math.max(LEAVE_LIMITS.sick - usage.sick, 0) }
      },
      requests: userRequests.map(r => ({
        id: r.id,
        leaveType: r.leave_type,
        startDate: r.start_date,
        endDate: r.end_date,
        status: r.status,
        reason: r.reason
      }))
    };
  }

  async applyLeave(userId, payload) {
    const { leaveType, startDate, endDate, reason } = payload;
    const start = new Date(startDate);
    const end = new Date(endDate || startDate); // Default to single day if no end date

    // Check for overlapping requests
    const overlap = await prisma.leaves.findFirst({
      where: {
        user_id: userId,
        status: { in: ACTIVE_STATUSES },
        NOT: { status: 'rejected' },
        AND: [
          { start_date: { lte: end } },
          { end_date: { gte: start } }
        ]
      }
    });

    if (overlap) throw new Error('You already have a leave request covering these dates');

    // Create the record in the unified 'leaves' table
    return await prisma.leaves.create({
      data: {
        user_id: userId,
        leave_type: leaveType,
        start_date: start,
        end_date: end,
        reason: reason || null,
        status: 'pending'
      }
    });
  }
}

module.exports = new LeavesService();