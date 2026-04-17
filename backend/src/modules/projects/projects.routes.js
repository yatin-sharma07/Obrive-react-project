const router     = require('express').Router();
const authenticate = require('../../middleware/auth');
const ctrl        = require('./projects.controller');

// GET /api/projects  — returns projects for the logged-in employee
router.get('/', authenticate, ctrl.getProjects);

// GET /api/projects/all  — returns all projects (admin / HR use)
router.get('/all', authenticate, ctrl.getAllProjects);

module.exports = router;
