// backend/src/modules/tasks/tasks.routes.js
const router = require('express').Router();
const authenticate = require('../../middleware/auth');
const ctrl = require('./tasks.controller');
const zodValidate = require('../../middleware/zodValidate');
const {
	CreateTaskBodySchema,
	TaskIdParamSchema,
	UpdateTaskBodySchema,
	ProjectIdParamSchema,
} = require('./tasks.validation');

// Create task for a project
router.post(
	'/:projectId',
	authenticate,
	zodValidate({ part: 'params', schema: ProjectIdParamSchema }),
	zodValidate({ part: 'body', schema: CreateTaskBodySchema }),
	ctrl.createTask
);

// Update task
router.put(
	'/:taskId',
	authenticate,
	zodValidate({ part: 'params', schema: TaskIdParamSchema }),
	zodValidate({ part: 'body', schema: UpdateTaskBodySchema }),
	ctrl.updateTask
);

// Get all tasks in a project
router.get(
	'/project/:projectId',
	authenticate,
	zodValidate({ part: 'params', schema: ProjectIdParamSchema }),
	ctrl.getTasksByProject
);

// Get all tasks assigned to or created by current user
router.get('/my-tasks', authenticate, ctrl.getMyTasks);

// Get task by ID
router.get(
	'/:taskId',
	authenticate,
	zodValidate({ part: 'params', schema: TaskIdParamSchema }),
	ctrl.getTaskById
);

// Delete task
router.delete(
	'/:taskId',
	authenticate,
	zodValidate({ part: 'params', schema: TaskIdParamSchema }),
	ctrl.deleteTask
);

// Get project team members (for task assignment)
router.get(
	'/project/:projectId/team',
	authenticate,
	zodValidate({ part: 'params', schema: ProjectIdParamSchema }),
	ctrl.getProjectTeamMembers
);

module.exports = router;
