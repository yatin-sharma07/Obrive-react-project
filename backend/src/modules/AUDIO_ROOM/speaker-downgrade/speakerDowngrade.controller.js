const {
  downgradeToListenerService,
} = require(
  "./speakerDowngrade.service"
);

const downgradeToListenerController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const result =
        await downgradeToListenerService(
          req.body
        );

      return res
        .status(200)
        .json(result);
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  downgradeToListenerController,
};
