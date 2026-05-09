const router = require('express').Router();
const authenticate = require('../../middleware/auth');
const ctrl = require('./work-sessions.controller');


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
  ctrl.endSession
);

module.exports = router;