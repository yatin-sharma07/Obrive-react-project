const service = require('./onboarding.service');
const { successResponse } = require('../../utils/apiResponse');

exports.sendOtp = async (req, res, next) => {
  try {
    const result = await service.sendOtp(req.body.phone);
    successResponse(res, result, 'OTP sent');
  } catch (err) { next(err); }
};

exports.verifyOtpAndRegister = async (req, res, next) => {
  try {
    const result = await service.verifyOtpAndRegister(req.body);
    successResponse(res, result, 'Account created', 201);
  } catch (err) { next(err); }
};

exports.aboutYourself = async (req, res, next) => {
  try {
    const result = await service.aboutYourself(req.user.id, req.body);
    successResponse(res, result, 'Profile updated');
  } catch (err) { next(err); }
};

exports.companyInfo = async (req, res, next) => {
  try {
    const result = await service.companyInfo(req.user.id, req.body);
    successResponse(res, result, 'Company info saved');
  } catch (err) { next(err); }
};

exports.inviteMembers = async (req, res, next) => {
  try {
    const result = await service.inviteMembers(req.user.id, req.body.emails);
    successResponse(res, result, 'Invitations sent');
  } catch (err) { next(err); }
};

exports.acceptInvite = async (req, res, next) => {
  try {
    const result = await service.acceptInvite(req.params.token);
    successResponse(res, result, 'Invite accepted');
  } catch (err) { next(err); }
};