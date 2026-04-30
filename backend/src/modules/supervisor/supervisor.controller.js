// backend/src/modules/supervisor/supervisor.controller.js
const supervisorService = require('./supervisor.service');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await supervisorService.getAllEmployees(req.user.id);
    successResponse(res, employees, 'Employees retrieved successfully');
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

exports.getEmployeeStatus = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await supervisorService.getEmployeeStatus(parseInt(employeeId));
    
    if (!employee) {
      return errorResponse(res, 'Employee not found', 404);
    }

    successResponse(res, employee, 'Employee status retrieved successfully');
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

exports.getEmployeeProjects = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const projects = await supervisorService.getEmployeeProjects(parseInt(employeeId));
    successResponse(res, projects, 'Employee projects retrieved successfully');
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

exports.getSupervisorProjects = async (req, res) => {
  try {
    const projects = await supervisorService.getSupervisorProjects(req.user.id);
    successResponse(res, projects, 'Supervisor projects retrieved successfully');
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

exports.getAllLeaveRequests = async (req, res) => {
  try {
    const leaves = await supervisorService.getAllLeaveRequests();
    successResponse(res, leaves, 'Leave requests retrieved successfully');
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};

exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const leave = await supervisorService.updateLeaveStatus(parseInt(id), status);
    successResponse(res, leave, 'Leave status updated successfully');
  } catch (error) {
    errorResponse(res, error.message, 400);
  }
};
