const service = require('./auth.service');
const { successResponse, errorResponse } = require('../../utils/apiResponse');
const workSessionService = require('../work-sessions/work-sessions.service');

const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

exports.loginUser = async (req, res, next) => {
  try {
    const result = await service.loginUser({
      ...req.body,
      ip:        req.ip,
      userAgent: req.headers['user-agent'],
    });
     res.cookie("accessToken", result.accessToken, authCookieOptions);

    res.cookie("refreshToken", result.refreshToken, authCookieOptions);
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
    // Auto-stop timer on logout
    // try {
    //   await timerService.stopTimer(req.user.id);
    //   console.log('⏹️  Timer auto-stopped for user:', req.user.id);
    // } catch (timerErr) {
    //   console.log('ℹ️  No active timer to stop:', timerErr.message);
    // }

        try {

      const activeSession =
        await workSessionService.getTodaySession(
          req.user.id
        );

      if (
        activeSession &&
        activeSession.status === 'active'
      ) {

        await workSessionService.endSession(
          req.user.id,
          activeSession.id
        );

        console.log(
          `⏹️ Work session stopped for user ${req.user.id}`
        );
      }

    } catch (err) {

      console.error(
        '❌ Failed to stop session during logout:',
        err
      );
    }

    const result = await service.logout({
      userId: req.user.id,
      logId:  req.user.logId,
    });

    res.clearCookie('accessToken', authCookieOptions);
    res.clearCookie('refreshToken', authCookieOptions);

    successResponse(res, result, 'Logged out');
  } catch (err) { next(err); }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken; // 👈 THIS LINE

    if (!token) {
      return errorResponse(res, 'Refresh token required', 400);
    }

    const result = await service.refreshToken(token);
    res.cookie("accessToken", result.accessToken, authCookieOptions);
    successResponse(res, result);
  } catch (err) {
    next(err);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    // Fetch full user details from database using userId from JWT token
    const result = await service.getCurrentUserDetails(req.user.id);
    successResponse(res, result, 'Current user fetched');
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const result = await service.getAllUsers();
    successResponse(res, result, 'Users fetched successfully');
  } catch (err) {
    next(err);
  }
};
