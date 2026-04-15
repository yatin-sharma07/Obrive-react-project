const service = require('./auth.service');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.loginUser = async (req, res, next) => {
  try {
    const result = await service.loginUser({
      ...req.body,
      ip:        req.ip,
      userAgent: req.headers['user-agent'],
    });
    successResponse(res, result, 'Login successful');
  } catch (err) { next(err); }
};

exports.loginClient = async (req, res, next) => {
  try {
    const result = await service.loginClient(req.body);
    successResponse(res, result, 'Client login successful');
  } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
  try {
    const result = await service.logout({
      userId: req.user.id,
      logId:  req.user.logId,
    });
    successResponse(res, result, 'Logged out');
  } catch (err) { next(err); }
};

exports.refreshToken = async (req, res, next) => {
  try {
   const token = req.cookies?.refreshToken;

if (!token) {
  return errorResponse(res, 'Refresh token required', 400);
}

const result = await service.refreshToken(token);
successResponse(res, result);
  } catch (err) { next(err); }
};