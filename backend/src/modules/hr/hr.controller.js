// backend/src/modules/hr/hr.controller.js
const hrService = require('./hr.service');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

// Get HR Dashboard
exports.getDashboard = async (req, res, next) => {
  try {
    const stats = await hrService.getDashboardStats();
    const recentEmployees = await hrService.getAllEmployees();
    const hrProfile = await hrService.getHRProfile(req.user.id);
    
    successResponse(res, { 
      profile: hrProfile,
      stats, 
      recentEmployees: recentEmployees.slice(0, 5)
    }, 'HR Dashboard retrieved');
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

// Get HR Profile
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await hrService.getHRProfile(req.user.id);
    successResponse(res, profile, 'Profile retrieved');
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

// Update HR Profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, dateOfBirth, phone } = req.body;
    const profile = await hrService.updateHRProfile(req.user.id, {
      name, bio, dateOfBirth, phone
    });
    successResponse(res, profile, 'Profile updated');
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

// Get all employees
exports.getAllEmployees = async (req, res, next) => {
  try {
    const employees = await hrService.getAllEmployees();
    successResponse(res, employees, 'Employees retrieved');
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await hrService.getEmployeeById(parseInt(req.params.id));
    successResponse(res, employee, 'Employee retrieved');
  } catch (err) {
    errorResponse(res, err.message, 404);
  }
};

// Update employee
exports.updateEmployee = async (req, res, next) => {
  try {
    const employee = await hrService.updateEmployee(parseInt(req.params.id), req.body);
    successResponse(res, employee, 'Employee updated');
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

// Delete employee
exports.deleteEmployee = async (req, res, next) => {
  try {
    await hrService.deleteEmployee(parseInt(req.params.id));
    successResponse(res, null, 'Employee deleted');
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

// Search employees
exports.searchEmployees = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return errorResponse(res, 'Search term required', 400);
    }
    const employees = await hrService.searchEmployees(q);
    successResponse(res, employees, 'Search results');
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};