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

exports.assignEmployeeToProject = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const { employeeId } = req.body;
    const assignment = await projectService.assignEmployeeToProject(projectId, employeeId);
    successResponse(res, assignment, 'Employee assigned to project');
  } catch (err) {
    errorResponse(res, err.message, 400);
  }
};

exports.removeEmployeeFromProject = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const employeeId = parseInt(req.params.employeeId);
    await projectService.removeEmployeeFromProject(projectId, employeeId);
    successResponse(res, null, 'Employee removed from project');
  } catch (err) {
    errorResponse(res, err.message, 400);
  }
};

exports.createProject = async (req, res) => {
  try {
    const project = await projectService.createProject(req.body);
    successResponse(res, project, 'Project created successfully', 201);
  } catch (err) {
    errorResponse(res, err.message, 400);
  }
};

exports.updateProjectProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    const project = await projectService.updateProjectProgress(id, progress, req.user.id);
    successResponse(res, project, 'Project progress updated');
  } catch (err) {
    errorResponse(res, err.message, 400);
  }
};

exports.getProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    const project = await projectService.getProjectStatus(id, progress, req.user.id);
    successResponse(res, project, 'Project progress updated');
  } catch (err) {
    errorResponse(res, err.message, 400);
  }
};

exports.assignProjectLeader = async (req, res) => {
  try {
    const { id } = req.params;
    const { leaderId } = req.body;
    const project = await projectService.assignProjectLeader(id, leaderId, req.user.id);
    successResponse(res, project, 'Project leader assigned');
  } catch (err) {
    errorResponse(res, err.message, 400);
  }
};

exports.getClientProjects = async (req, res) => {
  try {
    // Prefer numeric user id from token (set during client login), fall back to any provided clientId
    const clientId =  req.user.clientId; // 
    const projects = await projectService.getClientProjects(clientId);
    successResponse(res, projects, 'Client projects retrieved');
  } catch (err) {
    errorResponse(res, err.message, 500);
  }
};