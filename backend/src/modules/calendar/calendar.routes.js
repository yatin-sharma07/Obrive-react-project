const express = require('express');
const { 
  getCalendarTasks, 
  createCalendarTask, 
  updateCalendarTask, 
  deleteCalendarTask 
} = require('./calendar.controller.js');

const router = express.Router();

// GET all tasks (optionally filtered by date range)
router.get('/tasks', getCalendarTasks);

// POST - Create a new task
router.post('/tasks', createCalendarTask);

// PUT - Update a task (e.g., when dragged to a new date)
router.put('/tasks/:id', updateCalendarTask);

// DELETE - Delete a task
router.delete('/tasks/:id', deleteCalendarTask);

module.exports = router;