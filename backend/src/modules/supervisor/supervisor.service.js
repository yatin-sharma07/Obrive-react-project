// backend/src/modules/supervisor/supervisor.service.js
const { prisma } = require('../../config/db');

class SupervisorService {
  async getAllEmployees(supervisorId) {
    try {
      // Get all employees (you can add team filtering logic here later)
      const employees = await prisma.users.findMany({
        where: {
          role: 'employee',
        },
        select: {
          id: true,
          name: true,
          email: true,
          job_title: true,
          department: true,
          status: true,
          phone_number: true,
          date_of_birth: true,
        },
        orderBy: {
          name: 'asc',
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
          email: true,
          job_title: true,
        },
      });

      return employee;
    } catch (error) {
      throw new Error(`Failed to fetch employee status: ${error.message}`);
    }
  }

  async getSupervisorProjects(supervisorId) {
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
          created_at: 'desc',
        },
      });

      return projects;
    } catch (error) {
      throw new Error(`Failed to fetch supervisor projects: ${error.message}`);
    }
  }
}

module.exports = new SupervisorService();
