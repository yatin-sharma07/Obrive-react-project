const projectService = require('./projects.service');
const { successResponse, errorResponse } = require('../../utils/apiResponse');

exports.getProjects = async (req, res) => {
  try {
    const projects = await projectService.getEmployeeProjects(req.user.id);
    successResponse(res, projects, 'Projects retrieved');
  } catch (err) {
    console.error('❌ getProjects error:', err);
    errorResponse(res, err.message, 500);
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await projectService.getAllProjects();
    successResponse(res, projects, 'All projects retrieved');
  } catch (err) {
    console.error('❌ getAllProjects error:', err);
    errorResponse(res, err.message, 500);
  }
};
