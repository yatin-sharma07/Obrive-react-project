exports.successResponse = (res, data, message = 'Success', status = 200) =>
  res.status(status).json({ success: true, message, data });

exports.errorResponse = (res, message = 'Error', status = 500, errors = null) =>
  res.status(status).json({ success: false, message, ...(errors && { errors }) });