const service = require('./hr.service');
const { successResponse } = require('../../utils/apiResponse');

exports.getAllEmployees        = async (req, res, next) => {
  try { successResponse(res, await service.getAllEmployees(req.query)); }
  catch (err) { next(err); }
};
exports.getEmployee            = async (req, res, next) => {
  try { successResponse(res, await service.getEmployee(req.params.id)); }
  catch (err) { next(err); }
};
exports.getEmployeeLogs        = async (req, res, next) => {
  try { successResponse(res, await service.getEmployeeLogs(req.params.id)); }
  catch (err) { next(err); }
};
exports.getEmployeeAvailability = async (req, res, next) => {
  try { successResponse(res, await service.getEmployeeAvailability(req.params.id, req.query.date)); }
  catch (err) { next(err); }
};
exports.getAllProjects          = async (req, res, next) => {
  try { successResponse(res, await service.getAllProjects(req.query.status)); }
  catch (err) { next(err); }
};
exports.updateProjectStatus    = async (req, res, next) => {
  try { successResponse(res, await service.updateProjectStatus(req.params.id, req.body.status)); }
  catch (err) { next(err); }
};
exports.assignEmployee         = async (req, res, next) => {
  try { successResponse(res, await service.assignEmployee(req.user.id, req.body), 'Employee assigned', 201); }
  catch (err) { next(err); }
};
exports.unassignEmployee       = async (req, res, next) => {
  try { successResponse(res, await service.unassignEmployee(req.params.assignmentId)); }
  catch (err) { next(err); }
};