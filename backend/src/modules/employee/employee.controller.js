const service = require('./employee.service');
const authService = require('../auth/auth.service');
const { successResponse } = require('../../utils/apiResponse');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({
      email,
      password,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
    successResponse(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
};

exports.getMyProfile          = async (req, res, next) => {
  try { successResponse(res, await service.getMyProfile(req.user.id)); }
  catch (err) { next(err); }
};

exports.updateMyProfile       = async (req, res, next) => {
  try { successResponse(res, await service.updateMyProfile(req.user.id, req.body)); }
  catch (err) { next(err); }
};

exports.getMyAvailability     = async (req, res, next) => {
  try {
    const emp = await require('../../config/db').prisma.employee.findUnique({ where: { userId: req.user.id } });
    successResponse(res, await service.getAvailability(emp.id, req.query.date));
  } catch (err) { next(err); }
};

exports.addAvailabilitySlot   = async (req, res, next) => {
  try { successResponse(res, await service.addAvailabilitySlot(req.user.id, req.body), 'Slot added', 201); }
  catch (err) { next(err); }
};

exports.updateAvailabilitySlot = async (req, res, next) => {
  try { successResponse(res, await service.updateAvailabilitySlot(req.params.slotId, req.user.id, req.body)); }
  catch (err) { next(err); }
};

exports.deleteAvailabilitySlot = async (req, res, next) => {
  try { successResponse(res, await service.deleteAvailabilitySlot(req.params.slotId, req.user.id)); }
  catch (err) { next(err); }
};

exports.getEmployeeAvailability = async (req, res, next) => {
  try { successResponse(res, await service.getAvailability(req.params.employeeId, req.query.date)); }
  catch (err) { next(err); }
};

exports.getMyProjects = async (req, res, next) => {
  try { successResponse(res, await service.getMyProjects(req.user.id)); }
  catch (err) { next(err); }
};

exports.getMyLogs = async (req, res, next) => {
  try { successResponse(res, await service.getMyLogs(req.user.id)); }
  catch (err) { next(err); }
};