const { prisma } = require('../../config/db');

class VacationsService {
  async getAllEmployeesWithLeaves() {
    return await prisma.users.findMany({
      where: { role: 'employee' },
      select: {
        id: true,
        name: true,
        email: true,
        userid: true,
        leaves: {
          select: {
            id: true,
            user_id: true,
            leave_type: true,
            start_date: true,
            end_date: true,
            status: true,
            reason: true,
            users: {
              select: {
                id: true,
                name: true,
                email: true,
                userid: true
              }
            }
          }
        }
      }
    });
  }

  async requestLeave(userId, data) {
    return await prisma.leaves.create({
      data: {
        user_id: userId,
        leave_type: data.leave_type,
        start_date: new Date(data.start_date),
        end_date: new Date(data.end_date),
        reason: data.reason,
        status: 'pending' // As per request, user can only request holiday
      }
    });
  }
}

module.exports = new VacationsService();