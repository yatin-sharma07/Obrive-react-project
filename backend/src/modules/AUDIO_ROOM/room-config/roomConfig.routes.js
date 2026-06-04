const express = require("express");
const { createRoomConfig, getUsers, } = require("./roomConfig.controller");
const auth = require("../../../middleware/auth");
const zodValidate = require("../../../middleware/zodValidate");
const { createRoomConfigSchema } = require("./roomConfig.validation");
const router = express.Router();

router.post( "/create", auth, zodValidate({ part: "body", schema: createRoomConfigSchema }), createRoomConfig );
router.get( "/users", auth, getUsers );

module.exports = router;
