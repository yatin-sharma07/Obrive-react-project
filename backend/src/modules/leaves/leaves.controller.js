const leavesService = require('./leaves.service');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.getDashboard = async (req, res) => {
  try {
    const result = await leavesService.getDashboard(req.user.id, req.query.date);
    successResponse(res, result, 'Leave dashboard retrieved');
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

exports.applyLeave = async (req, res) => {
  try {
    const result = await leavesService.applyLeave(req.user.id, req.body);
    successResponse(res, result, 'Leave applied successfully', 201);
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};
