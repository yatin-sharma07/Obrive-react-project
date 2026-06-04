// backend/src/modules/client/client.routes.js
const router = require('express').Router();
const ctrl = require('./client.controller');
const authenticate = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');
const zodValidate = require('../../middleware/zodValidate');
const {
  ClientLoginBodySchema,
  ClientProjectIdParamSchema,
  RequestProjectBodySchema,
  UpdateClientProfileBodySchema,
} = require('./client.validation');

// ========== PUBLIC ROUTE ==========
router.post('/login', zodValidate({ part: 'body', schema: ClientLoginBodySchema }), ctrl.login);

// ========== PROTECTED ROUTES ==========
router.use(authenticate);
router.use(authorize('client'));

// Dashboard & Profile routes (NEW)
router.get('/dashboard', ctrl.getDashboard);
router.get('/profile', ctrl.getProfile);
router.put('/profile', zodValidate({ part: 'body', schema: UpdateClientProfileBodySchema }), ctrl.updateProfile);

// Existing routes
router.get('/me', ctrl.getMyProfile);
router.get('/projects', ctrl.getMyProjects);
router.get('/projects/:id', zodValidate({ part: 'params', schema: ClientProjectIdParamSchema }), ctrl.getProjectById);
router.post('/projects/request', zodValidate({ part: 'body', schema: RequestProjectBodySchema }), ctrl.requestProject);

module.exports = router;
