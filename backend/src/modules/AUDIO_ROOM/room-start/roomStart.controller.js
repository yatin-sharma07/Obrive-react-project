const {
  startRoomService,
} = require("./roomStart.service");

const startRoomController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const result =
        await startRoomService(
          req.body
        );

      return res
        .status(200)
        .json({
          success: true,
          data: result,
        });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  startRoomController,
};