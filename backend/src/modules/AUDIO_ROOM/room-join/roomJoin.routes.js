const express = require("express");
const router = express.Router();
const { joinRoomController, } = require("./roomJoin.controller");
const auth = require("../../../middleware/auth");

router.post( "/join", auth, joinRoomController);

module.exports = router;
