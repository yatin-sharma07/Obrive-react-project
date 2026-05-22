const {
  handleHandRequestActionService,
} = require("./roomHandAction.service");

const handleHandRequestActionController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const result =
        await handleHandRequestActionService(
          req.body
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
  handleHandRequestActionController,
};
