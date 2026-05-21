const {
  endRoomService,
} = require(
  "./roomEnd.service"
);

const endRoomController =
  async (
    req,
    res,
    next
  ) => {
    try {

      // TEMP USER ID
      // Later from auth
      const userId = 1;

      const result =
        await endRoomService(
          req.body,
          userId
        );

      return res
        .status(200)
        .json({
          success: true,
          data: result,
        });
    } catch (
      error
    ) {
      next(error);
    }
  };

module.exports = {
  endRoomController,
};