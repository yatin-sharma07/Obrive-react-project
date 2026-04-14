const router       = require('express').Router();
const ctrl         = require('./hr.controller');
const authenticate = require('../../middleware/auth');
const { authorize }= require('../../middleware/rbac');
const validate     = require('../../middleware/validate');
const { body }     = require('express-validator');

router.use(authenticate, authorize('HR', 'ADMIN'));

// Employees
router.get('/employees',                   ctrl.getAllEmployees);
router.get('/employees/:id',               ctrl.getEmployee);
router.get('/employees/:id/logs',          ctrl.getEmployeeLogs);
router.get('/employees/:id/availability',  ctrl.getEmployeeAvailability);

// Projects
router.get('/projects',                    ctrl.getAllProjects);
router.put('/projects/:id/status',
  [body('status').isIn(['PENDING','IN_PROGRESS','COMPLETED','ON_HOLD','CANCELLED'])],
  validate,
  ctrl.updateProjectStatus
);

// Assignments
router.post('/assign',
  [
    body('employeeId').notEmpty(),
    body('projectId').notEmpty(),
  ],
  validate,
  ctrl.assignEmployee
);
router.delete('/assign/:assignmentId',  ctrl.unassignEmployee);

module.exports = router;