const {
  createRoomConfigService,
  getAllUsers,
} = require("./roomConfig.service");

const createRoomConfig =
  async (req, res) => {
    try {
      const result =
        await createRoomConfigService(
          req.body,
          req.user.id
        );

      return res.status(201).json({
        success: true,
        message:
          "Room created successfully",
        data: result,
      });
    } catch (error) {
      console.error(
        "CREATE ROOM ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to create room",
      });
    }
  };

// ======================================
// GET USERS
// ======================================

const getUsers =
  async (req, res) => {
    try {
      const users =
        await getAllUsers();

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      console.error(
        "Get users error:",
        error
      );

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };

module.exports = {
  createRoomConfig,
  getUsers,
};