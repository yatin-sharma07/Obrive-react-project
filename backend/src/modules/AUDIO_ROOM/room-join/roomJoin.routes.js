const express = require("express");
const router = express.Router();
const { joinRoomController, } = require("./roomJoin.controller");
const auth = require("../../../middleware/auth");
const zodValidate = require("../../../middleware/zodValidate");
const { RoomJoinBodySchema } = require("./roomJoin.validation");

router.post( "/join", auth, zodValidate({ part: "body", schema: RoomJoinBodySchema }), joinRoomController);

module.exports = router;
