const vacationsService = require('./vacations.service');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

class VacationsController {
  async getEmployeesWithLeaves(req, res, next) {
    try {
      const employees = await vacationsService.getAllEmployeesWithLeaves();
      return successResponse(res, employees, 'Vacations fetched successfully');
    } catch (error) {
      console.error("Get Leaves Error:", error);
      next(error);
    }
  }

  async requestLeave(req, res, next) {
    try {
      const userId = req.user.id;
      const leaveData = req.body;

      if (!leaveData.leave_type || !leaveData.start_date || !leaveData.end_date) {
        return errorResponse(res, 'Missing required fields', 400);
      }

      const leave = await vacationsService.requestLeave(userId, leaveData);
      return successResponse(res, leave, 'Leave requested successfully', 201);
    } catch (error) {
      console.error("Create Leave Error:", error);
      next(error);
    }
  }
}

module.exports = new VacationsController();