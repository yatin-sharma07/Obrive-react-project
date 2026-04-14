const { validationResult } = require('express-validator');
const { errorResponse }    = require('../utils/apiResponse');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return errorResponse(res, 'Validation failed', 422, errors.array());
  next();
};