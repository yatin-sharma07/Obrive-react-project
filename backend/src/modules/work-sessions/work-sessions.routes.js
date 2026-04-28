const router = require('express').Router();
const authenticate = require('../../middleware/auth');
const ctrl = require('./work-sessions.controller');

router.post('/start-session', authenticate, ctrl.startSession);
router.post('/heartbeat', authenticate, ctrl.heartbeat);
router.post('/end-session', authenticate, ctrl.endSession);
router.get('/today-session', authenticate, ctrl.getTodaySession);
router.get('/day-stats', authenticate, ctrl.getDayStats);

module.exports = router;