const { endRoomService } = require("./roomEnd.service");

const endRoomController = async (req, res, next) => {
  try {
    // Fall back through authenticated user profiles down to the body parameters safely
    const userId = req.user?.id || req.body.userId;
    const userRole = req.user?.role; 

    if (!userId) {
      throw new Error("User identification signature is required.");
    }

    // Forward the extracted role parameters along as our third evaluation hook
    const result = await endRoomService(req.body, userId, userRole);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  endRoomController,
};