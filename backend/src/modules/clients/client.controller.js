const service = require('./client.service');
const { successResponse } = require('../../utils/apiResponse');

exports.getMyProfile   = async (req, res, next) => {
  try { successResponse(res, await service.getMyProfile(req.user.id)); }
  catch (err) { next(err); }
};

exports.getMyProjects  = async (req, res, next) => {
  try { successResponse(res, await service.getMyProjects(req.user.id)); }
  catch (err) { next(err); }
};

exports.getProjectById = async (req, res, next) => {
  try { successResponse(res, await service.getProjectById(req.user.id, req.params.id)); }
  catch (err) { next(err); }
};

exports.requestProject = async (req, res, next) => {
  try { successResponse(res, await service.requestProject(req.user.id, req.body), 'Project requested', 201); }
  catch (err) { next(err); }
};