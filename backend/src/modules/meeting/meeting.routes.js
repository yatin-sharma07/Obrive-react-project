const router       = require('express').Router();
const ctrl         = require('./meeting.controller');
const authenticate = require('../../middleware/auth');
const { authorize }= require('../../middleware/rbac');
const validate     = require('../../middleware/validate');
const { body }     = require('express-validator');

router.use(authenticate);

router.get('/',    authorize('HR','ADMIN','EMPLOYEE'), ctrl.getMeetings);

router.post('/',
  authorize('HR', 'ADMIN'),
  [
    body('title').notEmpty(),
    body('date').isDate(),
    body('startTime').matches(/^\d{2}:\d{2}$/),
    body('endTime').matches(/^\d{2}:\d{2}$/),
    body('participantIds').isArray({ min: 1 }).withMessage('At least one participant required'),
  ],
  validate,
  ctrl.scheduleMeeting
);

router.put('/:id/status',   authorize('HR', 'ADMIN'), ctrl.updateMeetingStatus);
router.delete('/:id',       authorize('HR', 'ADMIN'), ctrl.cancelMeeting);

module.exports = router;