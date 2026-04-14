const service = require('./meeting.service');
const { successResponse } = require('../../utils/apiResponse');

exports.getMeetings         = async (req, res, next) => {
  try { successResponse(res, await service.getMeetings(req.user.id, req.user.role)); }
  catch (err) { next(err); }
};
exports.scheduleMeeting     = async (req, res, next) => {
  try { successResponse(res, await service.scheduleMeeting(req.user.id, req.body), 'Meeting scheduled', 201); }
  catch (err) { next(err); }
};
exports.updateMeetingStatus = async (req, res, next) => {
  try { successResponse(res, await service.updateMeetingStatus(req.params.id, req.body.status)); }
  catch (err) { next(err); }
};
exports.cancelMeeting       = async (req, res, next) => {
  try { successResponse(res, await service.cancelMeeting(req.params.id)); }
  catch (err) { next(err); }
};