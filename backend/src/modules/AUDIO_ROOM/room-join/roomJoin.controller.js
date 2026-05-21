const { joinRoomService,} = require("./roomJoin.service");

const joinRoomController = async (req, res, next) => {
    try {
      const result = await joinRoomService( req.body);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  joinRoomController,
};

