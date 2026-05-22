const {
  getPendingHandRequestsService,
} = require("./roomHandRequests.service");

const getPendingHandRequestsController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const {
        roomId,
      } = req.params;

      const result =
        await getPendingHandRequestsService(
          roomId
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
  getPendingHandRequestsController,
};
