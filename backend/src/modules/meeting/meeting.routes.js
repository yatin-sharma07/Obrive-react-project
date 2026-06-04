const router       = require('express').Router();
const ctrl         = require('./meeting.controller');
const authenticate = require('../../middleware/auth');
const { authorize }= require('../../middleware/rbac');
const zodValidate  = require('../../middleware/zodValidate');
const {
  MeetingIdParamSchema,
  ScheduleMeetingBodySchema,
  UpdateMeetingStatusBodySchema,
} = require('./meeting.validation');

router.use(authenticate);

router.get('/',    authorize('HR','ADMIN','EMPLOYEE'), ctrl.getMeetings);

router.post('/',
  authorize('HR', 'ADMIN'),
  zodValidate({ part: 'body', schema: ScheduleMeetingBodySchema }),
  ctrl.scheduleMeeting
);

router.put(
  '/:id/status',
  authorize('HR', 'ADMIN'),
  zodValidate({ part: 'params', schema: MeetingIdParamSchema }),
  zodValidate({ part: 'body', schema: UpdateMeetingStatusBodySchema }),
  ctrl.updateMeetingStatus
);
router.delete('/:id', authorize('HR', 'ADMIN'), zodValidate({ part: 'params', schema: MeetingIdParamSchema }), ctrl.cancelMeeting);

module.exports = router;
