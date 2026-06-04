const express = require('express');
const { 
  getCalendarTasks, 
  createCalendarTask, 
  updateCalendarTask, 
  deleteCalendarTask 
} = require('./calendar.controller.js');
const zodValidate = require('../../middleware/zodValidate');
const {
  CalendarTaskIdParamSchema,
  CalendarTasksQuerySchema,
  CreateCalendarTaskBodySchema,
  UpdateCalendarTaskBodySchema,
} = require('./calendar.validation');

const router = express.Router();

// GET all tasks (optionally filtered by date range)
router.get('/tasks', zodValidate({ part: 'query', schema: CalendarTasksQuerySchema }), getCalendarTasks);

// POST - Create a new task
router.post('/tasks', zodValidate({ part: 'body', schema: CreateCalendarTaskBodySchema }), createCalendarTask);

// PUT - Update a task (e.g., when dragged to a new date)
router.put(
  '/tasks/:id',
  zodValidate({ part: 'params', schema: CalendarTaskIdParamSchema }),
  zodValidate({ part: 'body', schema: UpdateCalendarTaskBodySchema }),
  updateCalendarTask
);

// DELETE - Delete a task
router.delete('/tasks/:id', zodValidate({ part: 'params', schema: CalendarTaskIdParamSchema }), deleteCalendarTask);

module.exports = router;
