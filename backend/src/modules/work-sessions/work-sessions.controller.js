const workSessionService = require('./work-sessions.service');

const {
  successResponse,
  errorResponse
} = require('../../utils/apiResponse');


// =====================================================
// START / INIT SESSION
// =====================================================

exports.startSession = async (req, res) => {

  try {

    const userId = req.user.id;

    const session =
      await workSessionService.startSession(userId);

    return successResponse(
      res,
      session,
      'Session initialized successfully'
    );

  } catch (err) {

    console.error('❌ Start session controller error:', err);

    return errorResponse(
      res,
      err.message || 'Failed to start session',
      500
    );
  }
};


// =====================================================
// HEARTBEAT
// =====================================================

exports.heartbeat = async (req, res) => {

  try {

    const userId = req.user.id;

    const { sessionId } = req.body;

    if (!sessionId) {

      return errorResponse(
        res,
        'Session ID is required',
        400
      );
    }

    const session =
      await workSessionService.recordHeartbeat(
        userId,
        sessionId
      );

    return successResponse(
      res,
      session,
      'Heartbeat recorded'
    );

  } catch (err) {

    console.error('❌ Heartbeat controller error:', err);

    return errorResponse(
      res,
      err.message || 'Heartbeat failed',
      500
    );
  }
};


// =====================================================
// END SESSION
// =====================================================

exports.endSession = async (req, res) => {

  try {

    const userId = req.user.id;

    const { sessionId } = req.body;

    if (!sessionId) {

      return errorResponse(
        res,
        'Session ID is required',
        400
      );
    }

    const session =
      await workSessionService.endSession(
        userId,
        sessionId
      );

    return successResponse(
      res,
      session,
      'Session ended successfully'
    );

  } catch (err) {

    console.error('❌ End session controller error:', err);

    return errorResponse(
      res,
      err.message || 'Failed to end session',
      500
    );
  }
};


// =====================================================
// GET TODAY SESSION
// =====================================================

exports.getTodaySession = async (req, res) => {

  try {

    const userId = req.user.id;

    const session =
      await workSessionService.getTodaySession(userId);

    return successResponse(
      res,
      session,
      'Today session fetched successfully'
    );

  } catch (err) {

    console.error('❌ Get session controller error:', err);

    return errorResponse(
      res,
      err.message || 'Failed to fetch session',
      500
    );
  }
};