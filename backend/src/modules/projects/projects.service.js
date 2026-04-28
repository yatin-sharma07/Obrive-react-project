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

  async getUserProjects(userId) {
    const projects = await prisma.$queryRaw`SELECT 
                p.id, 
                p.name, 
                p.description, 
                p.priority, 
                p.created_at,
                COALESCE(
                    json_agg(json_build_object('id', u.id, 'name', u.name)) 
                    FILTER (WHERE u.id IS NOT NULL), 
                    '[]'::json
                ) AS team_members
            FROM projects p
            JOIN project_assignments pa ON p.id = pa.project_id
            LEFT JOIN project_assignments pa_inner ON p.id = pa_inner.project_id
            LEFT JOIN users u ON pa_inner.employee_id = u.id
            WHERE pa.employee_id = ${userId}
            GROUP BY p.id, p.name, p.description, p.priority, p.created_at`;
    
    // Convert BigInt to Number for JSON serialization
    const convertedProjects = projects.map(project => ({
      ...project,
      id: Number(project.id),
      team_members: project.team_members && project.team_members.length > 0 
        ? project.team_members.map(member => ({
            ...member,
            id: Number(member.id)
          }))
        : []
    }));

    // Fetch tasks for each project with visibility filtering
    const projectsWithTasks = await Promise.all(
      convertedProjects.map(async (project) => {
        const tasks = await prisma.$queryRaw`
          SELECT 
            t.id,
            t.project_id,
            t.task_number,
            t.title,
            t.description,
            t.deadline,
            t.status,
            t.assigned_to,
            t.created_by,
            t.created_at,
            t.updated_at,
            u_assigned.name as assigned_to_name,
            u_created.name as created_by_name
          FROM tasks t
          LEFT JOIN users u_assigned ON t.assigned_to = u_assigned.id
          LEFT JOIN users u_created ON t.created_by = u_created.id
          WHERE t.project_id = ${project.id}
            AND (
              t.created_by = ${userId}
              OR t.assigned_to = ${userId}
            )
          ORDER BY t.task_number
        `;

        return {
          ...project,
          tasks: tasks.map(task => ({
            ...task,
            id: Number(task.id),
            project_id: Number(task.project_id),
            assigned_to: task.assigned_to ? Number(task.assigned_to) : null,
            created_by: task.created_by ? Number(task.created_by) : null
          }))
        };
      })
    );

    return projectsWithTasks;
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