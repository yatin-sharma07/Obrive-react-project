const express =
  require("express");

const router =
  express.Router();

const {
  handleHandRequestActionController,
} = require("./roomHandAction.controller");
const auth = require("../../../middleware/auth");
const zodValidate = require("../../../middleware/zodValidate");
const { requireRoomRoles } = require("../audioRoomAuthz");
const { RoomHandActionBodySchema } = require("./roomHandAction.validation");

router.post(
  "/hand-action",
  auth,
  requireRoomRoles(["host", "moderator", "admin"]),
  zodValidate({ part: "body", schema: RoomHandActionBodySchema }),
  handleHandRequestActionController
);

module.exports =
  router;
