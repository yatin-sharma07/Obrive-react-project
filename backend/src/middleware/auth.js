const { verifyAccessToken } = require('../utils/jwt');
const { errorResponse }     = require('../utils/apiResponse');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    return errorResponse(res, 'No token provided', 401);

  try {
    const token = authHeader.split(' ')[1];
    req.user    = verifyAccessToken(token);
    next();
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return errorResponse(res, msg, 401);
  }
};