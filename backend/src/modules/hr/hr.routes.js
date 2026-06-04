// backend/src/modules/hr/hr.routes.js
const router = require('express').Router();
const ctrl = require('./hr.controller');
const authenticate = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');
const zodValidate = require('../../middleware/zodValidate');
const {
  EmployeeIdParamSchema,
  SearchEmployeesQuerySchema,
  UpdateEmployeeBodySchema,
  UpdateHrProfileBodySchema,
} = require('./hr.validation');

// All HR routes require authentication and HR role
router.use(authenticate);
router.use(authorize('hr'));

// Dashboard
router.get('/dashboard', ctrl.getDashboard);

// Profile
router.get('/profile', ctrl.getProfile);
router.put('/profile', zodValidate({ part: 'body', schema: UpdateHrProfileBodySchema }), ctrl.updateProfile);

// Employee Management
router.get('/employees', ctrl.getAllEmployees);
router.get('/employees/search', zodValidate({ part: 'query', schema: SearchEmployeesQuerySchema }), ctrl.searchEmployees);
router.get('/employees/:id', zodValidate({ part: 'params', schema: EmployeeIdParamSchema }), ctrl.getEmployeeById);
router.put(
  '/employees/:id',
  zodValidate({ part: 'params', schema: EmployeeIdParamSchema }),
  zodValidate({ part: 'body', schema: UpdateEmployeeBodySchema }),
  ctrl.updateEmployee
);
router.delete('/employees/:id', zodValidate({ part: 'params', schema: EmployeeIdParamSchema }), ctrl.deleteEmployee);

module.exports = router;
