const { verifyAccessToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/apiResponse');

module.exports = (req, res, next) => {
  try {
    let token;

    // 🔥 Check cookie first
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
      console.log("COOKIES:", req.cookies);
    }
    // fallback to header
    else if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 'No token provided', 401);
    }

    req.user = verifyAccessToken(token);
    next();
  } catch (err) {
    const msg =
      err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return errorResponse(res, msg, 401);
  }
};