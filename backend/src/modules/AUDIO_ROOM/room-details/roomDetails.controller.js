const {
  getRoomDetailsService,
} = require(
  "./roomDetails.service"
);

const getRoomDetailsController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        roomId,
      } = req.params;

      const userId =
        req.user.id;

      const result =
        await getRoomDetailsService(
          roomId,
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
  getRoomDetailsController,
};
