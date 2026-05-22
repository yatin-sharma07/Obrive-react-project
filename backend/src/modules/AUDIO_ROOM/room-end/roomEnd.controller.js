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
      const userId =
        req.body.userId ||
        req.user?.id;

      if (!userId) {
        throw new Error(
          "User id is required"
        );
      }

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
