const { getTasksForCalendar, createTask, updateTask, deleteTask } = require('./calandar.service.js');

const getCalendarTasks = async (req, res) => {
  try {
    // 1. Extract data from the request
    const { startDate, endDate } = req.query;

    // 2. Call the Service layer to get the data
    const allTasks = await getTasksForCalendar(startDate, endDate);

    // 3. Send the successful HTTP response
    return res.status(200).json({
      success: true,
      count: allTasks.length,
      data: allTasks,
    });
    
  } catch (error) {
    console.error("Error in calendar controller:", error);
    // Send the error HTTP response
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching tasks",
      error: error.message
    });
  }
};

/**
 * CREATE a new task
 * POST /api/calendar/tasks
 * Body: { title, description, deadline, assigned_to, created_by, project_id }
 */
const createCalendarTask = async (req, res) => {
  try {
    const taskData = req.body;
    
    console.log("📝 Creating task with data:", taskData);

    // Validate required fields
    if (!taskData.title || taskData.title.trim() === '') {
      console.log("❌ Validation failed: title is empty");
      return res.status(400).json({
        success: false,
        message: "Task title is required"
      });
    }

    console.log("✅ Validation passed, calling service...");

    // Call service to create task
    const newTask = await createTask(taskData);

    console.log("✅ Task created successfully:", newTask);

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: newTask
    });

  } catch (error) {
    console.error("❌ Error creating task:", error);
    console.error("Error Stack:", error.stack);
    
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the task",
      error: error.message,
      details: error.code || error.meta // Include Prisma error details
    });
  }
};

/**
 * UPDATE an existing task (e.g., when dragged to a different date)
 * PUT /api/calendar/tasks/:id
 * Body: { deadline, status, title, description, assigned_to }
 */
const updateCalendarTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validate task ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid task ID is required"
      });
    }

    // Call service to update task
    const updatedTask = await updateTask(id, updateData);

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask
    });

  } catch (error) {
    console.error("Error updating task:", error);

    // Handle "record not found" error
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the task",
      error: error.message
    });
  }
};

/**
 * DELETE a task
 * DELETE /api/calendar/tasks/:id
 */
const deleteCalendarTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate task ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid task ID is required"
      });
    }

    // Call service to delete task
    const deletedTask = await deleteTask(id);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: deletedTask
    });

  } catch (error) {
    console.error("Error deleting task:", error);

    // Handle "record not found" error
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the task",
      error: error.message
    });
  }
};

module.exports = { getCalendarTasks, createCalendarTask, updateCalendarTask, deleteCalendarTask };