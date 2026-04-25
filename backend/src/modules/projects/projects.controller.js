const projectService = require('./projects.service');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.getUserProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await projectService.getUserProjects(userId);
    successResponse(res, projects, 'User projects retrieved');
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

exports.getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    const projects = await projectService.getProjectsByRole(userId, userRole);
    successResponse(res, projects, 'Projects retrieved');
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const project = await projectService.getProjectById(projectId);
    successResponse(res, project, 'Project details retrieved');
  } catch (err) {
    errorResponse(res, err.message, 404);
  }
};