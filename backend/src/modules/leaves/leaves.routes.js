const router = require('express').Router();
const { body, query } = require('express-validator');
const authenticate = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');
const validate = require('../../middleware/validate');
const ctrl = require('./leaves.controller');

router.use(authenticate);
router.use(authorize('employee', 'EMPLOYEE'));

router.get(
  '/dashboard',
  [
    query('date')
      .optional()
      .isISO8601()
      .withMessage('date must be a valid date in YYYY-MM-DD format'),
  ],
  validate,
  ctrl.getDashboard
);

router.post(
  '/apply',
  [
    body('leaveType')
      .isIn(['vacation', 'sick'])
      .withMessage('leaveType must be either vacation or sick'),
    body('leaveDate')
      .isISO8601()
      .withMessage('leaveDate must be a valid date in YYYY-MM-DD format'),
    body('reason')
      .optional()
      .isString()
      .withMessage('reason must be a string'),
  ],
  validate,
  ctrl.applyLeave
);

module.exports = router;
