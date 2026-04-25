const router = require('express').Router();
const authenticate = require('../../middleware/auth');
const ctrl = require('./projects.controller');


router.get('/', authenticate, ctrl.getProjects);

router.get('/:id', authenticate, ctrl.getProjectById);

router.get('/user/projects', authenticate, ctrl.getUserProjects);

module.exports = router;