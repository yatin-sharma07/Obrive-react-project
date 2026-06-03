const router = require('express').Router();
const authenticate = require('../../middleware/auth');
const zodValidate = require('../../middleware/zodValidate');
const ctrl = require('./work-sessions.controller');
const { sessionIdSchema } = require('./work-sessions.validation');


// =====================================================
// SESSION INITIALIZATION
// =====================================================

router.post(
  '/init',
  authenticate,
  ctrl.startSession
);


// =====================================================
// HEARTBEAT
// =====================================================

router.post(
  '/heartbeat',
  authenticate,
  zodValidate({ part: 'body', schema: sessionIdSchema }),
  ctrl.heartbeat
);


// =====================================================
// GET CURRENT SESSION
// =====================================================

router.get(
  '/current',
  authenticate,
  ctrl.getTodaySession
);


// =====================================================
// STOP SESSION
// =====================================================

router.post(
  '/stop',
  authenticate,
  zodValidate({ part: 'body', schema: sessionIdSchema }),
  ctrl.endSession
);

module.exports = router;