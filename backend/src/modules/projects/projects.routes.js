const router = require('express').Router();
const authenticate = require('../../middleware/auth');
const ctrl = require('./projects.controller');

// Specific routes first
router.get('/user/projects', authenticate, ctrl.getUserProjects);
router.get('/client/projects', authenticate, ctrl.getClientProjects);
router.get('/clients/list', authenticate, ctrl.getAllClients);  

// Generic routes after
router.get('/', authenticate, ctrl.getProjects);
router.post('/', authenticate, ctrl.createProject);

router.get('/:id', authenticate, ctrl.getProjectById);
router.get('/:id/status', authenticate, ctrl.getProjectStatus);
// router.put('/:id/progress', authenticate, ctrl.updateProjectProgress);
router.put('/:id/leader', authenticate, ctrl.assignProjectLeader);
router.put('/:id', authenticate, ctrl.updateProject);

router.post('/:id/assign', authenticate, ctrl.assignEmployeeToProject);
router.delete('/:id/assign/:employeeId', authenticate, ctrl.removeEmployeeFromProject);

module.exports = router;