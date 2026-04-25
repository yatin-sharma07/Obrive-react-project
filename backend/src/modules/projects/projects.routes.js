const router = require('express').Router();
const authenticate = require('../../middleware/auth');
const ctrl = require('./projects.controller');

// Specific routes first
router.get('/user/projects', authenticate, ctrl.getUserProjects);

// Generic routes after
router.get('/', authenticate, ctrl.getProjects);

router.get('/:id', authenticate, ctrl.getProjectById);

module.exports = router;