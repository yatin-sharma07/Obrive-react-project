// backend/src/modules/projects/projects.service.js
const { prisma } = require('../../../prisma');

class ProjectService {
  
  async getProjectsByRole(userId, role) {
    let projects;
    
    if (role === 'hr') {
      projects = await this.getAllProjects();
    } 
    
    if (role === 'employee') {
      projects = await this.getEmployeeProjects(userId);
    }

    // if (role === 'client') {
    //   projects = await this.getClientProjects(userId);
    // }
    
    
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
        p.deadline,
        p.progress,
        p.leader_id,
        p.created_at,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as total_tasks,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'completed') as completed_tasks,
        (SELECT COUNT(*) FROM project_assignments pa WHERE pa.project_id = p.id) as assignees_count
      FROM projects p
      ORDER BY p.created_at DESC
    `;
    
    return result.map(p => ({
      ...p,
      id: Number(p.id),
      leader_id: p.leader_id ? Number(p.leader_id) : null,
      progress: p.progress ? Number(p.progress) : 0,
      total_tasks: Number(p.total_tasks),
      completed_tasks: Number(p.completed_tasks),
      assignees_count: Number(p.assignees_count)
    }));
  }

  async getClientProjects(clientId) {
    // Fetch projects associated with a client. Note: this assumes a numeric `client_id` column
    // exists on the `projects` table. If your schema uses a different relationship, update
    // the WHERE clause accordingly.
    const result = await prisma.$queryRaw`
      SELECT 
        p.id,
        p.project_id,
        p.name,
        p.description,
        p.priority,
        p.deadline,
        p.progress,
        p.leader_id,
        p.created_at,
        p.project_status,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as total_tasks,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'completed') as completed_tasks,
        (SELECT COUNT(*) FROM project_assignments pa WHERE pa.project_id = p.id) as assignees_count
      FROM projects p
      WHERE p.client_id = ${clientId}
      ORDER BY p.created_at DESC
    `;

    return result.map(p => ({
      ...p,
      id: Number(p.id),
      leader_id: p.leader_id ? Number(p.leader_id) : null,
      progress: p.progress ? Number(p.progress) : 0,
      total_tasks: Number(p.total_tasks || 0),
      completed_tasks: Number(p.completed_tasks || 0),
      assignees_count: Number(p.assignees_count || 0)
    }));
  }
  
  async getEmployeeProjects(employeeId) {
    const result = await prisma.$queryRaw`
      SELECT 
        p.id,
        p.project_id,
        p.name,
        p.description,
        p.priority,
        p.deadline,
        p.progress,
        p.leader_id,
        p.created_at,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) as total_tasks,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'completed') as completed_tasks,
        (SELECT COUNT(*) FROM project_assignments pa WHERE pa.project_id = p.id) as assignees_count
      FROM projects p
      JOIN project_assignments pa ON pa.project_id = p.id
      WHERE pa.employee_id = ${employeeId}
      ORDER BY p.created_at DESC
    `;
    
    return result.map(p => ({ // returns an array so that we can map through it and convert BigInt to Number for JSON serialization
      ...p,
      id: Number(p.id),
      leader_id: p.leader_id ? Number(p.leader_id) : null,
      progress: p.progress ? Number(p.progress) : 0,
      total_tasks: Number(p.total_tasks),
      completed_tasks: Number(p.completed_tasks),
      assignees_count: Number(p.assignees_count)
    }));
  }

  
  async getProjectById(projectId) {
    const project = await prisma.$queryRaw`
      SELECT p.*, u.name as created_by_name, l.name as leader_name
      FROM projects p
      LEFT JOIN users u ON u.id = p.created_by
      LEFT JOIN users l ON l.id = p.leader_id
      WHERE p.id = ${projectId}
      LIMIT 1
    `;
    
    const tasks = await prisma.$queryRaw`
      SELECT t.*, u.name as assigned_to_name
      FROM tasks t
      LEFT JOIN users u ON u.id = t.assigned_to
      WHERE t.project_id = ${projectId}
      ORDER BY t.created_at DESC
    `;

    const teamMembers = await prisma.$queryRaw`
      SELECT u.id, u.name, u.email, u.job_title, u.department
      FROM project_assignments pa
      JOIN users u ON pa.employee_id = u.id
      WHERE pa.project_id = ${projectId}
    `;
    
    // Convert BigInt in tasks as well
    const convertedTasks = tasks.map(task => ({
      ...task,
      id: Number(task.id),
      project_id: Number(task.project_id),
      assigned_to: task.assigned_to ? Number(task.assigned_to) : null
    }));

    const convertedTeamMembers = teamMembers.map(member => ({
      ...member,
      id: Number(member.id)
    }));
    
    return { 
      project: project[0] ? { 
        ...project[0], 
        id: Number(project[0].id),
        leader_id: project[0].leader_id ? Number(project[0].leader_id) : null,
        progress: project[0].progress ? Number(project[0].progress) : 0
      } : null, 
      tasks: convertedTasks,
      team_members: convertedTeamMembers
    };
  }

  async assignEmployeeToProject(projectId, employeeId) {
    try {
      const assignment = await prisma.project_assignments.create({
        data: {
          project_id: projectId,
          employee_id: employeeId,
        },
      });
      return assignment;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Employee is already assigned to this project');
      }
      throw error;
    }
  }

  async removeEmployeeFromProject(projectId, employeeId) {
    const result = await prisma.project_assignments.deleteMany({
      where: {
        project_id: projectId,
        employee_id: employeeId,
      },
    });
    if (result.count === 0) {
      throw new Error('Employee is not assigned to this project');
    }
  }

  async createProject(data) {
    const { name, description, priority, project_id, team_members, deadline, client_id } = data;
    
    return await prisma.$transaction(async (tx) => {
      // 1. Create the project
      const project = await tx.projects.create({
        data: {
          name,
          description,
          priority: priority || 'medium',
          project_id: project_id || `PROJ-${Date.now()}`,
          deadline: deadline ? new Date(deadline) : null,
          progress: 0,
          client_id: client_id ? String(client_id) : null,
        },
      });

      // 2. Assign team members if any
      if (team_members && Array.isArray(team_members) && team_members.length > 0) {
        const assignments = team_members.map(employeeId => ({
          project_id: project.id,
          employee_id: Number(employeeId),
        }));

        await tx.project_assignments.createMany({
          data: assignments,
          skipDuplicates: true,
        });
      }

      return project;
    });
  }

  async deleteProject(projectId, userId) {
    const targetProject = await prisma.projects.findUnique({
      where: { id: parseInt(projectId) },
    });

    if (!targetProject) {
      throw new Error('Project not found');
    }

    const requestingUser = await prisma.users.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!requestingUser) {
      throw new Error('User not found');
    }

    if (
      requestingUser.role !== 'supervisor' &&
      requestingUser.role !== 'hr' &&
      requestingUser.role !== 'admin'
    ) {
      throw new Error('Only supervisors, HR, or admins can delete projects');
    }

    await prisma.$transaction(async (tx) => {
      await tx.tasks.deleteMany({
        where: { project_id: parseInt(projectId) },
      });

      await tx.project_assignments.deleteMany({
        where: { project_id: parseInt(projectId) },
      });

      await tx.projects.delete({
        where: { id: parseInt(projectId) },
      });
    });

    return { message: 'Project deleted successfully' };
  }

  async updateProjectProgress(projectId, progress, userId) {
    const project = await prisma.projects.findUnique({
      where: { id: parseInt(projectId) },
      include: {
        project_assignments: true
      }
    });

    if (!project) throw new Error('Project not found');

    // Check if user is leader or supervisor
    const user = await prisma.users.findUnique({ where: { id: userId } });
    const isLeader = project.leader_id === userId;
    const isSupervisor = user.role === 'supervisor' || user.role === 'hr';

    if (!isLeader && !isSupervisor) {
      throw new Error('Only the project leader or supervisor can update progress');
    }

    return await prisma.projects.update({
      where: { id: parseInt(projectId) },
      data: { progress: parseInt(progress) }
    });
  }

    async getProjectStatus(projectId, progress, userId) {
    const project = await prisma.projects.findUnique({
      where: { id: parseInt(projectId) },
      include: {
        project_assignments: true
      }
    });

    if (!project) throw new Error('Project not found');

    // Check if user is leader or supervisor
    const user = await prisma.users.findUnique({ where: { id: userId } });
    const isClient = project.client_id === userId;
    const isSupervisor = user.role === 'supervisor' || user.role === 'hr';

    if (!isClient && !isSupervisor) {
      throw new Error('Only client or supervisor can view progress');
    }

    return await prisma.projects.update({
      where: { id: parseInt(projectId) },
      data: { progress: parseInt(progress) }
    });
  }


async updateProject(id, projectData, userId) {
  // 1. Check if project exists
  const targetProject = await prisma.projects.findUnique({
    where: { id: parseInt(id) },
  });
  
  if (!targetProject) {
    throw new Error('Project not found');
  }

  // 2. Check User Role
  const requestingUser = await prisma.users.findUnique({
    where: { id: parseInt(userId) },
  });

  if (!requestingUser) {
    throw new Error('User not found');
  }

  if (requestingUser.role !== 'supervisor' && requestingUser.role !== 'hr' && requestingUser.role !== 'admin') {
    throw new Error('Only supervisors, HR, or admins can update projects');
  }

// 3. STRICT CLEANING: Jo fields schema me nahi hain ya relational hain unhe nikalein
const { 
  id: _, 
  created_at, 
  updated_at, 
  tasks, 
  project_assignments,
  leader,
  status, // 👈 Frontend se aane wale galat 'status' ko yahan extract karke alag kiya
  team_members,
  ...rawCleanData 
} = projectData;

const cleanData = { ...rawCleanData };

// 4. Sahi Column Map Karein (Agar frontend ka status database ke project_status me save karna hai)
if (status) {
  cleanData.project_status = status; // 👈 status ki jagah project_status use karein
}

// Data Types Validation
if (cleanData.leader_id) {
  cleanData.leader_id = parseInt(cleanData.leader_id);
}
if (cleanData.progress) {
  cleanData.progress = parseInt(cleanData.progress);
}
if (cleanData.deadline) {
  cleanData.deadline = new Date(cleanData.deadline);
}

// 5. Final Prisma Query
const result = await prisma.$transaction(async (tx) => {
  const updatedProject = await tx.projects.update({
    where: { id: parseInt(id) },
    data: cleanData,
  });

  if (Array.isArray(team_members)) {
    await tx.project_assignments.deleteMany({
      where: { project_id: parseInt(id) },
    });

    const normalizedTeamMembers = team_members
      .map((member) => Number(member))
      .filter((memberId) => Number.isInteger(memberId));

    if (normalizedTeamMembers.length > 0) {
      await tx.project_assignments.createMany({
        data: normalizedTeamMembers.map((employeeId) => ({
          project_id: parseInt(id),
          employee_id: employeeId,
        })),
        skipDuplicates: true,
      });
    }
  }

  return updatedProject;
});

return result;
}


  async assignProjectLeader(projectId, leaderId, userId) {
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (user.role !== 'supervisor' && user.role !== 'hr') {
      throw new Error('Only supervisors can assign project leaders');
    }

    return await prisma.projects.update({
      where: { id: parseInt(projectId) },
      data: { leader_id: parseInt(leaderId) }
    });
  }

  async getAllClients() {
    // Fetch all clients (users with role = 'client')
    const result = await prisma.$queryRaw`
      SELECT id, userid, email, name
      FROM users
      WHERE role = 'client'
      ORDER BY name ASC
    `;

    return result.map(client => ({
      id: Number(client.id),
      userid: client.userid,
      email: client.email,
      name: client.name
    }));
  }
}

module.exports = new ProjectService();