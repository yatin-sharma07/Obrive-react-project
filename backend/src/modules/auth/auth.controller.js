const service = require('./auth.service');
const { successResponse, errorResponse } = require('../../utils/apiResponse');


//  LOGIN (Employee + HR + Admin)
exports.loginUser = async (req, res, next) => {
  try {
    const result = await service.loginUser({
      ...req.body,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    //  SET COOKIES
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return successResponse(res, {
      user: result.user,
      redirectTo: getRoleRedirect(result.user.role),
    }, 'Login successful');

  } catch (err) {
    next(err);
  }
};


//  CLIENT LOGIN
exports.loginClient = async (req, res, next) => {
  try {
    const result = await service.loginClient(req.body);

    // SET COOKIE (only access token for client)
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return successResponse(res, {
      user: result.user, // ✅ FIXED (was client before)
      redirectTo: '/dashboard/client',
    }, 'Client login successful');

  } catch (err) {
    next(err);
  }
};


// 🚪 LOGOUT
exports.logout = async (req, res, next) => {
  try {
    // If employee/HR/admin session exists → log it
    if (req.user?.logId) {
      await service.logout({
        userId: req.user.id,
        logId: req.user.logId
      });
    }

    // 🍪 CLEAR COOKIES
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return successResponse(res, {
      message: 'Logged out successfully'
    });

  } catch (err) {
    next(err);
  }
};


// 🔄 REFRESH TOKEN
exports.refreshToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.refreshToken ||
      req.body?.refreshToken;

    if (!token) {
      return errorResponse(res, 'Refresh token required', 400);
    }

    const result = await service.refreshToken(token);

    // 🍪 SET NEW ACCESS TOKEN
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return successResponse(res, {
      message: 'Token refreshed'
    });

  } catch (err) {
    next(err);
  }
};


// 🎯 ROLE → REDIRECT
function getRoleRedirect(role) {
  const routes = {
    ADMIN: '/dashboard/admin',
    HR: '/dashboard/hr',
    employee: '/dashboard/employee', // match DB value
  };

  return routes[role] || '/dashboard';
}