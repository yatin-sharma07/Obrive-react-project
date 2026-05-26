const { createLiveKitTokenForRoom } = require("../services/livekitToken.service");

const createLiveKitTokenController = async (req, res, next) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: "roomId is required",
      });
    }

    const result = await createLiveKitTokenForRoom({
      roomId,
      userId: req.user.id,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLiveKitTokenController,
};
