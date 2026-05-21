const express = require("express");

const router = express.Router();

const {
  getRoomsController,
} = require("./getRooms.controller");

router.get(
  "/rooms",
  getRoomsController
);

module.exports = router;