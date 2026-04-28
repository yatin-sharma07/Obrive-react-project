// backend/src/modules/hr/hr.routes.js
const router = require('express').Router();
const ctrl = require('./hr.controller');
const authenticate = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');

// All HR routes require authentication and HR role
router.use(authenticate);
router.use(authorize('hr'));

// Dashboard
router.get('/dashboard', ctrl.getDashboard);

// Profile
router.get('/profile', ctrl.getProfile);
router.put('/profile', ctrl.updateProfile);

// Employee Management
router.get('/employees', ctrl.getAllEmployees);
router.get('/employees/search', ctrl.searchEmployees);
router.get('/employees/:id', ctrl.getEmployeeById);
router.put('/employees/:id', ctrl.updateEmployee);
router.delete('/employees/:id', ctrl.deleteEmployee);

module.exports = router;