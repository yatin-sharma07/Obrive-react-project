const express = require("express");
const { createRoomConfig, getUsers, } = require("./roomConfig.controller");
const auth = require("../../../middleware/auth");
const router = express.Router();

router.post( "/create", auth, createRoomConfig );
router.get( "/users", auth, getUsers );

module.exports = router;
