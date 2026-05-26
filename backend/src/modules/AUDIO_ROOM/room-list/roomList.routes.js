const express = require("express");

const router = express.Router();

const {
  getRoomsController,
} = require("./getRooms.controller");
const auth = require("../../../middleware/auth");

router.get(
  "/rooms",
  auth,
  getRoomsController
);

module.exports = router;
