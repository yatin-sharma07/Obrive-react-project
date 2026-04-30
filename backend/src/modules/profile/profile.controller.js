const service = require('./profile.service');
const { successResponse } = require('../../utils/apiResponse');

exports.getProfileById = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    if (req.user?.id !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const profile = await service.getProfileById(userId);
    successResponse(res, profile, 'Profile loaded');
  } catch (err) {
    next(err);
  }
};

exports.updateProfileById = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    if (req.user?.id !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const profile = await service.updateProfileById(userId, req.body);
    successResponse(res, profile, 'Profile updated');
  } catch (err) {
    next(err);
  }
};
