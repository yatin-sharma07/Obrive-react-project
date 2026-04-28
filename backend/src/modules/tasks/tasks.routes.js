// backend/src/modules/tasks/tasks.routes.js
const router = require('express').Router();
const authenticate = require('../../middleware/auth');
const ctrl = require('./tasks.controller');

// Create task for a project
router.post('/:projectId', authenticate, ctrl.createTask);

// Update task
router.put('/:taskId', authenticate, ctrl.updateTask);

// Get all tasks in a project
router.get('/project/:projectId', authenticate, ctrl.getTasksByProject);

// Get task by ID
router.get('/:taskId', authenticate, ctrl.getTaskById);

// Delete task
router.delete('/:taskId', authenticate, ctrl.deleteTask);

// Get all tasks assigned to or created by current user
router.get('/my-tasks', authenticate, ctrl.getMyTasks);

// Get project team members (for task assignment)
router.get('/project/:projectId/team', authenticate, ctrl.getProjectTeamMembers);

module.exports = router;
