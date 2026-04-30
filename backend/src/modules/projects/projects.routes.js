const router = require('express').Router();
const authenticate = require('../../middleware/auth');
const ctrl = require('./projects.controller');

// Specific routes first
router.get('/user/projects', authenticate, ctrl.getUserProjects);

// Generic routes after
router.get('/', authenticate, ctrl.getProjects);
router.post('/', authenticate, ctrl.createProject);

router.get('/:id', authenticate, ctrl.getProjectById);
router.put('/:id/progress', authenticate, ctrl.updateProjectProgress);
router.put('/:id/leader', authenticate, ctrl.assignProjectLeader);

router.post('/:id/assign', authenticate, ctrl.assignEmployeeToProject);
router.delete('/:id/assign/:employeeId', authenticate, ctrl.removeEmployeeFromProject);

module.exports = router;