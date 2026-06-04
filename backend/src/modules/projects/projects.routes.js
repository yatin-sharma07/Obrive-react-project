const router = require('express').Router();
const authenticate = require('../../middleware/auth');
const ctrl = require('./projects.controller');
const zodValidate = require('../../middleware/zodValidate');
const {
  AssignEmployeeBodySchema,
  AssignProjectLeaderBodySchema,
  CreateProjectBodySchema,
  ProjectAssignmentParamSchema,
  ProjectIdParamSchema,
  UpdateProjectProgressBodySchema,
  UpdateProjectBodySchema,
} = require('./projects.validation');

// Specific routes first
router.get('/user/projects', authenticate, ctrl.getUserProjects);
router.get('/client/projects', authenticate, ctrl.getClientProjects);
router.get('/clients/list', authenticate, ctrl.getAllClients);  

// Generic routes after
router.get('/', authenticate, ctrl.getProjects);
router.post('/', authenticate, zodValidate({ part: 'body', schema: CreateProjectBodySchema }), ctrl.createProject);
router.delete('/:id', authenticate, zodValidate({ part: 'params', schema: ProjectIdParamSchema }), ctrl.deleteProject);

router.get('/:id', authenticate, zodValidate({ part: 'params', schema: ProjectIdParamSchema }), ctrl.getProjectById);
router.get('/:id/status', authenticate, zodValidate({ part: 'params', schema: ProjectIdParamSchema }), ctrl.getProjectStatus);
router.put(
  '/:id/progress',
  authenticate,
  zodValidate({ part: 'params', schema: ProjectIdParamSchema }),
  zodValidate({ part: 'body', schema: UpdateProjectProgressBodySchema }),
  ctrl.updateProjectProgress
);
router.put(
  '/:id/leader',
  authenticate,
  zodValidate({ part: 'params', schema: ProjectIdParamSchema }),
  zodValidate({ part: 'body', schema: AssignProjectLeaderBodySchema }),
  ctrl.assignProjectLeader
);
router.put(
  '/:id',
  authenticate,
  zodValidate({ part: 'params', schema: ProjectIdParamSchema }),
  zodValidate({ part: 'body', schema: UpdateProjectBodySchema }),
  ctrl.updateProject
);

router.post(
  '/:id/assign',
  authenticate,
  zodValidate({ part: 'params', schema: ProjectIdParamSchema }),
  zodValidate({ part: 'body', schema: AssignEmployeeBodySchema }),
  ctrl.assignEmployeeToProject
);
router.delete(
  '/:id/assign/:employeeId',
  authenticate,
  zodValidate({ part: 'params', schema: ProjectAssignmentParamSchema }),
  ctrl.removeEmployeeFromProject
);

module.exports = router;
