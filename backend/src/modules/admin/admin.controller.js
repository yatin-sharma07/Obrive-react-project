const service = require('./admin.service');
const { successResponse } = require('../../utils/apiResponse');

exports.getAllUsers      = async (req, res, next) => {
  try { successResponse(res, await service.getAllUsers()); }
  catch (err) { next(err); }
};
exports.createEmployee  = async (req, res, next) => {
  try { successResponse(res, await service.createEmployee(req.body), 'Employee created', 201); }
  catch (err) { next(err); }
};
exports.createHr        = async (req, res, next) => {
  try { successResponse(res, await service.createHr(req.body), 'HR created', 201); }
  catch (err) { next(err); }
};
exports.createClient    = async (req, res, next) => {
  try { successResponse(res, await service.createClient(req.body), 'Client created', 201); }
  catch (err) { next(err); }
};
exports.toggleUserActive = async (req, res, next) => {
  try { successResponse(res, await service.toggleUserActive(req.params.id)); }
  catch (err) { next(err); }
};
exports.deleteUser      = async (req, res, next) => {
  try { successResponse(res, await service.deleteUser(req.params.id)); }
  catch (err) { next(err); }
};
exports.getAllLogs       = async (req, res, next) => {
  try { successResponse(res, await service.getAllLogs(req.query)); }
  catch (err) { next(err); }
};
exports.getDashboardStats = async (req, res, next) => {
  try { successResponse(res, await service.getDashboardStats()); }
  catch (err) { next(err); }
};