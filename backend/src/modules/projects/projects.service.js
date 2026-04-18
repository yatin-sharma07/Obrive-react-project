// backend/src/modules/projects/projects.service.js
const { prisma } = require('../../config/db');

class ProjectService {
  
  async getProjectsByRole(userId, role) {
    let projects;
    
    if (role === 'hr') {
      projects = await this.getAllProjects();
    } else {
      projects = await this.getEmployeeProjects(userId);
    }
    
    // Convert BigInt to Number for JSON serialization
    return projects.map(project => ({
      ...project,
      total_tasks: project.total_tasks ? Number(project.total_tasks) : 0,
      completed_tasks: project.completed_tasks ? Number(project.completed_tasks) : 0,
      assignees_count: project.assignees_count ? Number(project.assignees_count) : 0
    }));
  }
  
  async getAllProjects() {
    const result = await prisma.$queryRaw`
      SELECT 
        p.id,
        p.project_id,
        p.name,
        p.description,
        p.priority,
        p.created_at,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as total_tasks,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'completed') as completed_tasks,
        (SELECT COUNT(*) FROM project_assignments pa WHERE pa.project_id = p.id) as assignees_count
      FROM projects p
      ORDER BY p.created_at DESC
    `;
    
    return result;
  }
  
  async getEmployeeProjects(employeeId) {
    const result = await prisma.$queryRaw`
      SELECT 
        p.id,
        p.project_id,
        p.name,
        p.description,
        p.priority,
        p.created_at,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as total_tasks,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'completed') as completed_tasks,
        (SELECT COUNT(*) FROM project_assignments pa WHERE pa.project_id = p.id) as assignees_count
      FROM projects p
      JOIN project_assignments pa ON pa.project_id = p.id
      WHERE pa.employee_id = ${employeeId}
      ORDER BY p.created_at DESC
    `;
    
    return result;
  }
  
  async getProjectById(projectId) {
    const project = await prisma.$queryRaw`
      SELECT p.*, u.name as created_by_name
      FROM projects p
      LEFT JOIN users u ON u.id = p.created_by
      WHERE p.id = ${projectId}
      LIMIT 1
    `;
    
    const tasks = await prisma.$queryRaw`
      SELECT t.*, u.name as assigned_to_name
      FROM tasks t
      LEFT JOIN users u ON u.id = t.assigned_to
      WHERE t.project_id = ${projectId}
      ORDER BY t.task_number
    `;
    
    // Convert BigInt in tasks as well
    const convertedTasks = tasks.map(task => ({
      ...task,
      id: Number(task.id),
      project_id: Number(task.project_id),
      assigned_to: task.assigned_to ? Number(task.assigned_to) : null
    }));
    
    return { 
      project: project[0] ? { ...project[0], id: Number(project[0].id) } : null, 
      tasks: convertedTasks 
    };
  }
}

module.exports = new ProjectService();