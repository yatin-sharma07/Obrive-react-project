// backend/src/modules/tasks/tasks.service.js
const { prisma } = require('../../config/db');

class TaskService {
  async createTask(projectId, taskData, creatorId) {
    try {
      // Verify user is part of the project
      const projectAssignment = await prisma.project_assignments.findFirst({
        where: {
          project_id: projectId,
          employee_id: creatorId,
        },
      });

      if (!projectAssignment) {
        throw new Error('You are not assigned to this project');
      }

      // Generate task number
      const lastTask = await prisma.tasks.findFirst({
        where: { project_id: projectId },
        orderBy: { id: 'desc' },
      });

      const taskNumber = lastTask
        ? `TASK-${Number(lastTask.task_number.split('-')[1]) + 1}`
        : 'TASK-1';

      // Create task
      const task = await prisma.tasks.create({
        data: {
          project_id: projectId,
          task_number: taskNumber,
          title: taskData.title,
          description: taskData.description || null,
          deadline: taskData.deadline ? new Date(taskData.deadline) : null,
          status: taskData.status || 'pending',
          assigned_to: taskData.assigned_to || null,
          created_by: creatorId,
        },
      });

      // Fetch task with related user information
      const fullTask = await prisma.tasks.findUnique({
        where: { id: task.id },
        include: {
          assigned_user: {
            select: { id: true, name: true, email: true },
          },
          creator: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return fullTask;
    } catch (error) {
      throw error;
    }
  }

  async updateTask(taskId, userId, updateData) {
    try {
      // Verify user is the creator or assigned person
      const task = await prisma.tasks.findUnique({
        where: { id: taskId },
      });

      if (!task) {
        throw new Error('Task not found');
      }

      if (task.created_by !== userId && task.assigned_to !== userId) {
        throw new Error('You do not have permission to update this task');
      }

      // Update task
      const updatedTask = await prisma.tasks.update({
        where: { id: taskId },
        data: {
          ...(updateData.title && { title: updateData.title }),
          ...(updateData.description !== undefined && {
            description: updateData.description,
          }),
          ...(updateData.deadline && { deadline: new Date(updateData.deadline) }),
          ...(updateData.status && { status: updateData.status }),
          ...(updateData.assigned_to && { assigned_to: updateData.assigned_to }),
          updated_at: new Date(),
        },
        include: {
          assigned_user: {
            select: { id: true, name: true, email: true },
          },
          creator: {
            select: { id: true, name: true, email: true },
          },
        },
      });

      return updatedTask;
    } catch (error) {
      throw error;
    }
  }

  async getTasksByProject(projectId, userId) {
    try {
      // Get all tasks where user is creator or assigned person
      const tasks = await prisma.tasks.findMany({
        where: {
          project_id: projectId,
          OR: [{ created_by: userId }, { assigned_to: userId }],
        },
        include: {
          assigned_user: {
            select: { id: true, name: true, email: true },
          },
          creator: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { created_at: 'desc' },
      });

      return tasks;
    } catch (error) {
      throw error;
    }
  }

  async getTaskById(taskId, userId) {
    try {
      const task = await prisma.tasks.findUnique({
        where: { id: taskId },
        include: {
          assigned_user: {
            select: { id: true, name: true, email: true },
          },
          creator: {
            select: { id: true, name: true, email: true },
          },
          projects: {
            select: { id: true, name: true },
          },
        },
      });

      if (!task) {
        throw new Error('Task not found');
      }

      // Verify user has access to this task
      if (task.created_by !== userId && task.assigned_to !== userId) {
        throw new Error(
          'You do not have permission to view this task'
        );
      }

      return task;
    } catch (error) {
      throw error;
    }
  }

  async deleteTask(taskId, userId) {
    try {
      const task = await prisma.tasks.findUnique({
        where: { id: taskId },
      });

      if (!task) {
        throw new Error('Task not found');
      }

      // Only creator can delete task
      if (task.created_by !== userId) {
        throw new Error('Only the task creator can delete this task');
      }

      await prisma.tasks.delete({
        where: { id: taskId },
      });

      return { message: 'Task deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getMyTasks(userId) {
    try {
      // Get all tasks assigned to or created by the user
      const tasks = await prisma.tasks.findMany({
        where: {
          OR: [{ created_by: userId }, { assigned_to: userId }],
        },
        include: {
          assigned_user: {
            select: { id: true, name: true, email: true },
          },
          creator: {
            select: { id: true, name: true, email: true },
          },
          projects: {
            select: { id: true, name: true },
          },
        },
        orderBy: { created_at: 'desc' },
      });

      return tasks;
    } catch (error) {
      throw error;
    }
  }

  async getProjectTeamMembers(projectId) {
    try {
      const members = await prisma.project_assignments.findMany({
        where: { project_id: projectId },
        include: {
          users: {
            select: { id: true, name: true, email: true, job_title: true },
          },
        },
      });

      return members.map((m) => m.users);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TaskService();
