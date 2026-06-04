const router = require('express').Router();
const authenticate = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');
const zodValidate = require('../../middleware/zodValidate');
const ctrl = require('./leaves.controller');
const {
  ApplyLeaveBodySchema,
  LeaveDashboardQuerySchema,
  LeaveIdParamSchema,
} = require('./leaves.validation');

router.use(authenticate);

router.get(
  '/dashboard',
  authorize('employee', 'supervisor', 'hr'),
  zodValidate({ part: 'query', schema: LeaveDashboardQuerySchema }),
  ctrl.getDashboard
);

router.post(
  '/apply',
  authorize('employee'),
  zodValidate({ part: 'body', schema: ApplyLeaveBodySchema }),
  ctrl.applyLeave
);

router.delete(
  '/:id',
  authorize('employee', 'supervisor', 'hr'),
  zodValidate({ part: 'params', schema: LeaveIdParamSchema }),
  ctrl.deleteLeave
);

module.exports = router;
