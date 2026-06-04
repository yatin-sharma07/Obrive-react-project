const router       = require('express').Router();
const ctrl         = require('./admin.controller');
const authenticate = require('../../middleware/auth');
const { authorize }= require('../../middleware/rbac');
const zodValidate  = require('../../middleware/zodValidate');
const {
  CreateClientBodySchema,
  CreateEmployeeBodySchema,
  CreateHrBodySchema,
  LogsQuerySchema,
  UserIdParamSchema,
} = require('./admin.validation');

// ── Create Employee (ADMIN + HR) ─────────────────────────────
router.post('/users/employee',
  authenticate,
  authorize('ADMIN', 'HR'),
  zodValidate({ part: 'body', schema: CreateEmployeeBodySchema }),
  ctrl.createEmployee
);

// ── Create HR (ADMIN only) ───────────────────────────────────
router.post('/users/hr',
  authenticate,
  authorize('ADMIN'),
  zodValidate({ part: 'body', schema: CreateHrBodySchema }),
  ctrl.createHr
);

// ── Create Client (ADMIN + HR) ───────────────────────────────
router.post('/users/client',
  authenticate,
  authorize('ADMIN', 'HR'),
  zodValidate({ part: 'body', schema: CreateClientBodySchema }),
  ctrl.createClient
);

// ── Toggle active (ADMIN + HR) ───────────────────────────────
router.put('/users/:id/toggle-active',
  authenticate,
  authorize('ADMIN', 'HR'),
  zodValidate({ part: 'params', schema: UserIdParamSchema }),
  ctrl.toggleUserActive
);

// ── Delete user (ADMIN only) ─────────────────────────────────
router.delete('/users/:id',
  authenticate,
  authorize('ADMIN'),
  zodValidate({ part: 'params', schema: UserIdParamSchema }),
  ctrl.deleteUser
);

// ── View all users (ADMIN + HR) ──────────────────────────────
router.get('/users',
  authenticate,
  authorize('ADMIN', 'HR'),
  ctrl.getAllUsers
);

// ── Logs & Stats (ADMIN only) ────────────────────────────────
router.get('/logs',
  authenticate,
  authorize('ADMIN'),
  zodValidate({ part: 'query', schema: LogsQuerySchema }),
  ctrl.getAllLogs
);

router.get('/stats',
  authenticate,
  authorize('ADMIN'),
  ctrl.getDashboardStats
);

module.exports = router;
