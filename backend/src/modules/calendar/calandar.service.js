const { prisma } = require('../../../prisma');

/**
 * Fetch tasks between an optional start and end date
 * @param {string} startDate - Start date of the calendar view
 * @param {string} endDate - End date of the calendar view
 * @returns {Array} List of tasks
 */
const getTasksForCalendar = async (startDate, endDate) => {
  let queryConditions = {};
  
  // If dates are provided, filter the tasks
  if (startDate && endDate) {
    queryConditions = {
      where: {
        // Using 'deadline' field from tasks table in schema.prisma
        deadline: {
          gte: new Date(startDate), 
          lte: new Date(endDate),   
        },
      },
    };
  }

  // Fetch the tasks from the database
  const tasks = await prisma.tasks.findMany(queryConditions);
  
  return tasks;
};

/**
 * Create a new task
 * @param {Object} taskData - Task data (title, description, deadline, assigned_to, created_by, etc.)
 * @returns {Object} Created task
 */
const createTask = async (taskData) => {
  const {
    title,
    description,
    deadline,
    location,
    status = 'pending',
    assigned_to,
    created_by,
    project_id,
    task_number
  } = taskData;

  // Validate required fields
  if (!title) {
    throw new Error('Task title is required');
  }

  // Generate task_number if not provided
  let generatedTaskNumber = task_number;
  if (!generatedTaskNumber) {
    // Generate a unique task number: TASK-TIMESTAMP
    const timestamp = Date.now();
    generatedTaskNumber = `TASK-${timestamp}`;
  }

  // Create the task in the database
  const newTask = await prisma.tasks.create({
    data: {
      title,
      task_number: generatedTaskNumber,
      description: description || null,
      deadline: deadline ? new Date(deadline) : null,
      location: location || null,
      status,
      assigned_to: assigned_to || null,
      created_by: created_by || null,
      project_id: project_id || null,
    },
  });

  return newTask;
};

/**
 * Update an existing task
 * @param {number} taskId - Task ID to update
 * @param {Object} updateData - Fields to update (deadline, status, title, description, etc.)
 * @returns {Object} Updated task
 */
const updateTask = async (taskId, updateData) => {
  const {
    title,
    description,
    deadline,
    location,
    status,
    assigned_to
  } = updateData;

  // Build only the fields that are provided
  const dataToUpdate = {};
  if (title !== undefined) dataToUpdate.title = title;
  if (description !== undefined) dataToUpdate.description = description;
  if (deadline !== undefined) dataToUpdate.deadline = deadline ? new Date(deadline) : null;
  if (location !== undefined) dataToUpdate.location = location;
  if (status !== undefined) dataToUpdate.status = status;
  if (assigned_to !== undefined) dataToUpdate.assigned_to = assigned_to;

  // Update the task
  const updatedTask = await prisma.tasks.update({
    where: { id: parseInt(taskId) },
    data: dataToUpdate,
  });

  return updatedTask;
};

/**
 * Delete a task
 * @param {number} taskId - Task ID to delete
 * @returns {Object} Deleted task
 */
const deleteTask = async (taskId) => {
  const deletedTask = await prisma.tasks.delete({
    where: { id: parseInt(taskId) },
  });

  return deletedTask;
};

module.exports = { getTasksForCalendar, createTask, updateTask, deleteTask };