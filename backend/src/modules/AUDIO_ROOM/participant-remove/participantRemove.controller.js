const {
  removeParticipantService,
} = require(
  "./participantRemove.service"
);

const removeParticipantController =
  async (
    req,
    res,
    next
  ) => {
    try {
      const result =
        await removeParticipantService(
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
  removeParticipantController,
};
