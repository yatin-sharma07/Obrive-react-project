// backend/src/modules/client/client.routes.js
const router = require('express').Router();
const ctrl = require('./client.controller');
const authenticate = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');

// ========== PUBLIC ROUTE ==========
router.post('/login', ctrl.login);

// ========== PROTECTED ROUTES ==========
router.use(authenticate);
router.use(authorize('client'));

// Dashboard & Profile routes (NEW)
router.get('/dashboard', ctrl.getDashboard);
router.get('/profile', ctrl.getProfile);
router.put('/profile', ctrl.updateProfile);

// Existing routes
router.get('/me', ctrl.getMyProfile);
router.get('/projects', ctrl.getMyProjects);
router.get('/projects/:id', ctrl.getProjectById);
router.post('/projects/request', ctrl.requestProject);

module.exports = router;