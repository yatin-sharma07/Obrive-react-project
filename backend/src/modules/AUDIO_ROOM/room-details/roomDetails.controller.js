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

      // TEMP USER ID
      // Later from auth
      const userId =
        req.query.userId ||
        5;

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