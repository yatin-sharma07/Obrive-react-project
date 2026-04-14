const { errorResponse } = require('../utils/apiResponse');

exports.authorize = (...roles) => (req, res, next) => {
  if (!req.user)
    return errorResponse(res, 'Unauthorized', 401);

  if (!roles.includes(req.user.role))
    return errorResponse(res, `Access denied. Required: ${roles.join(' or ')}`, 403);

  next();
};