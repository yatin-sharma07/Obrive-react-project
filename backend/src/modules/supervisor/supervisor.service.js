// backend/src/modules/supervisor/supervisor.service.js
const { prisma } = require("../../../prisma");

class SupervisorService {
  async getAllEmployees(_supervisorId) {
    try {
      // Get all employees (you can add team filtering logic here later)
      const employees = await prisma.users.findMany({
        where: {
          role: "employee",
        },
        select: {
          id: true,
          name: true,
          email: true,
          job_title: true,
          department: true,
          status: true,
          is_active: true,
          phone_number: true,
          date_of_birth: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return employees;
    } catch (error) {
      throw new Error(`Failed to fetch employees: ${error.message}`);
    }
  }

  async getEmployeeProjects(employeeId) {
    try {
      const projects = await prisma.projects.findMany({
        where: {
          project_assignments: {
            some: {
              employee_id: employeeId,
            },
          },
        },
        include: {
          project_assignments: {
            include: {
              users: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          tasks: true,
        },
      });

      return projects;
    } catch (error) {
      throw new Error(`Failed to fetch employee projects: ${error.message}`);
    }
  }

  async getEmployeeStatus(employeeId) {
    try {
      const employee = await prisma.users.findUnique({
        where: {
          id: employeeId,
        },
        select: {
          id: true,
          name: true,
          status: true,
          is_active: true,
          email: true,
          job_title: true,
        },
      });

      return employee;
    } catch (error) {
      throw new Error(`Failed to fetch employee status: ${error.message}`);
    }
  }

  async getSupervisorProjects(_supervisorId) {
    try {
      // Get all projects created by or assigned to this supervisor
      const projects = await prisma.projects.findMany({
        include: {
          project_assignments: {
            include: {
              users: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  job_title: true,
                },
              },
            },
          },
          tasks: true,
        },
        orderBy: {
          created_at: "desc",
        },
      });

      return projects;
    } catch (error) {
      throw new Error(`Failed to fetch supervisor projects: ${error.message}`);
    }
  }

  async blockEmployeeAccess(employeeId) {
    try {
      const employee = await prisma.users.findFirst({
        where: {
          id: employeeId,
          role: "employee",
        },
      });

      if (!employee) {
        throw new Error("Employee not found");
      }

      return await prisma.users.update({
        where: {
          id: employeeId,
        },
        data: {
          status: "inactive",
          is_active: false,
          updated_at: new Date(),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          is_active: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to block employee access: ${error.message}`);
    }
  }

  async deleteEmployee(employeeId) {
    try {
      const employee = await prisma.users.findFirst({
        where: {
          id: employeeId,
          role: "employee",
        },
      });

      if (!employee) {
        throw new Error("Employee not found");
      }

      await prisma.$transaction(async (tx) => {
        await tx.events.updateMany({
          where: { created_by: employeeId },
          data: { created_by: null },
        });

        await tx.projects.updateMany({
          where: { leader_id: employeeId },
          data: { leader_id: null },
        });

        await tx.tasks.updateMany({
          where: { assigned_to: employeeId },
          data: { assigned_to: null, updated_at: new Date() },
        });

        await tx.tasks.updateMany({
          where: { created_by: employeeId },
          data: { created_by: null, updated_at: new Date() },
        });

        await tx.login_logs.deleteMany({
          where: { userId: employeeId },
        });

        await tx.leave_requests.deleteMany({
          where: { user_id: employeeId },
        });

        await tx.work_sessions.deleteMany({
          where: { userId: employeeId },
        });

        await tx.sticky_notes.deleteMany({
          where: { user_id: employeeId },
        });

        await tx.leaves.deleteMany({
          where: { user_id: employeeId },
        });

        await tx.project_assignments.deleteMany({
          where: { employee_id: employeeId },
        });

        await tx.users.delete({
          where: {
            id: employeeId,
          },
        });
      });

      return { id: employeeId };
    } catch (error) {
      throw new Error(`Failed to delete employee: ${error.message}`);
    }
  }

  async getAllLeaveRequests() {
    try {
      const leaves = await prisma.leaves.findMany({
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
          {
            start_date: "asc",
          },
          {
            created_at: "asc",
          },
        ],
      });

      return leaves;
    } catch (error) {
      throw new Error(`Failed to fetch leave requests: ${error.message}`);
    }
  }

  async updateLeaveStatus(leaveId, status) {
    try {
      const validStatuses = ["approved", "rejected", "pending"];
      if (!validStatuses.includes(status)) {
        throw new Error(
          "Invalid status. Must be approved, rejected, or pending",
        );
      }

      const leave = await prisma.leaves.update({
        where: {
          id: leaveId,
        },
        data: {
          status: status,
          updated_at: new Date(),
        },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return leave;
    } catch (error) {
      throw new Error(`Failed to update leave status: ${error.message}`);
    }
  }

  async deleteLeaveRequest(leaveId) {
    try {
      const leave = await prisma.leaves.findUnique({
        where: {
          id: leaveId,
        },
      });

      if (!leave) {
        throw new Error("Leave request not found");
      }

      await prisma.leaves.delete({
        where: {
          id: leaveId,
        },
      });

      return { id: leaveId };
    } catch (error) {
      throw new Error(`Failed to delete leave request: ${error.message}`);
    }
  }
}

module.exports = new SupervisorService();
