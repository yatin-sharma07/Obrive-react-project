const express = require("express");
const router = express.Router();
const { joinRoomController, } = require("./roomJoin.controller");

router.post( "/join",joinRoomController);

module.exports = router;