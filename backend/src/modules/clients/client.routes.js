const router       = require('express').Router();
const ctrl         = require('./client.controller');
const authenticate = require('../../middleware/auth');
const { authorize }= require('../../middleware/rbac');
const validate     = require('../../middleware/validate');
const { body }     = require('express-validator');

router.use(authenticate);

router.get('/me',              authorize('CLIENT'), ctrl.getMyProfile);
router.get('/projects',        authorize('CLIENT'), ctrl.getMyProjects);
router.get('/projects/:id',    authorize('CLIENT'), ctrl.getProjectById);

router.post('/projects/request',
  authorize('CLIENT'),
  [
    body('title').notEmpty().withMessage('Project title required'),
    body('description').optional().isString(),
  ],
  validate,
  ctrl.requestProject
);

module.exports = router;