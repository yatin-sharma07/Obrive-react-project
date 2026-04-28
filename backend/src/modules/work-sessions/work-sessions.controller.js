const workSessionService = require('./work-sessions.service');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.startSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const session = await workSessionService.startSession(userId);
    
    successResponse(res, {
      sessionId: session.id,
      sessionStart: session.sessionStart,
      totalActiveDuration: session.totalActiveDuration
    }, 'Session started');
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

exports.heartbeat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.body;

    if (!sessionId) {
      return errorResponse(res, 'Session ID required', 400);
    }

    const session = await workSessionService.recordHeartbeat(userId, sessionId);
    
    successResponse(res, {
      sessionId: session.id,
      totalActiveDuration: session.totalActiveDuration,
      lastHeartbeat: session.lastHeartbeat,
      status: session.status
    }, 'Heartbeat recorded');
  } catch (err) {
    errorResponse(res, err.message, err.message.includes('auto-ended') ? 410 : 500);
  }
};

exports.endSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.body;

    if (!sessionId) {
      return errorResponse(res, 'Session ID required', 400);
    }

    const session = await workSessionService.endSession(userId, sessionId);
    
    successResponse(res, {
      sessionId: session.id,
      totalActiveDuration: session.totalActiveDuration,
      sessionEnd: session.sessionEnd
    }, 'Session ended');
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

exports.getTodaySession = async (req, res) => {
  try {
    const userId = req.user.id;
    const session = await workSessionService.getTodaySession(userId);
    
    successResponse(res, session, 'Today session retrieved');
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

exports.getDayStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await workSessionService.getDayStats(userId);
    
    successResponse(res, stats, 'Day statistics retrieved');
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};