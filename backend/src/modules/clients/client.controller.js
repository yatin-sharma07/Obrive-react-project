// backend/src/modules/client/client.controller.js
const service = require('./client.service');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

// ========== LOGIN CONTROLLER (NEW) ==========
exports.login = async (req, res, next) => {
  try {
    const { clientId } = req.body;
    
    if (!clientId) {
      return errorResponse(res, 'Client ID is required', 400);
    }
    
    const result = await service.clientLogin(clientId);
    successResponse(res, result, 'Login successful');
  } catch (err) {
    errorResponse(res, err.message || 'Login failed', err.status || 401);
  }
};

// ========== EXISTING CONTROLLERS (Updated to match his style) ==========
exports.getMyProfile = async (req, res, next) => {
  try { 
    const data = await service.getMyProfile(req.user.id);
    successResponse(res, data, 'Profile retrieved successfully');
  } catch (err) { 
    errorResponse(res, err.message || 'Error fetching profile', err.status || 500);
  }
};

exports.getMyProjects = async (req, res, next) => {
  try { 
    const data = await service.getMyProjects(req.user.id);
    successResponse(res, data, 'Projects retrieved successfully');
  } catch (err) { 
    errorResponse(res, err.message || 'Error fetching projects', err.status || 500);
  }
};

exports.getProjectById = async (req, res, next) => {
  try { 
    const data = await service.getProjectById(req.user.id, req.params.id);
    successResponse(res, data, 'Project retrieved successfully');
  } catch (err) { 
    errorResponse(res, err.message || 'Error fetching project', err.status || 500);
  }
};

exports.requestProject = async (req, res, next) => {
  try { 
    const data = await service.requestProject(req.user.id, req.body);
    successResponse(res, data, 'Project requested successfully', 201);
  } catch (err) { 
    errorResponse(res, err.message || 'Error requesting project', err.status || 500);
  }
};