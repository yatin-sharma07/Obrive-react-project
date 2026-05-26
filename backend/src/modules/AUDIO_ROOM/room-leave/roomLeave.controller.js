const {
  leaveRoomService,
} = require(
  "./roomLeave.service"
);

const leaveRoomController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const result =
        await leaveRoomService(
          {
            ...req.body,
            userId: req.user.id,
          }
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
  leaveRoomController,
};
