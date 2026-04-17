const { prisma } = require('../../config/db');

class ProjectService {

  async getEmployeeProjects(employeeId) {
    return await prisma.$queryRaw`
      SELECT
        p.project_id,
        p.name,
        p.description,
        p.priority,
        p.created_at,
        COUNT(DISTINCT t.id)::TEXT AS total_tasks
      FROM projects p
      JOIN project_assignments pa ON pa.project_id = p.id
      LEFT JOIN tasks t ON t.project_id = p.id
      WHERE pa.employee_id = ${employeeId}
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;
  }

  async getAllProjects() {
    return await prisma.$queryRaw`
      SELECT
        p.project_id,
        p.name,
        p.description,
        p.priority,
        p.created_at,
        COUNT(DISTINCT pa.employee_id)::TEXT AS total_members,
        COUNT(DISTINCT t.id)::TEXT           AS total_tasks
      FROM projects p
      LEFT JOIN project_assignments pa ON pa.project_id = p.id
      LEFT JOIN tasks t ON t.project_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;
  }
}

module.exports = new ProjectService();
