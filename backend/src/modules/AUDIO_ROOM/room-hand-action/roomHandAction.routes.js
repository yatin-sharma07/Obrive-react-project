const express =
  require("express");

const router =
  express.Router();

const {
  handleHandRequestActionController,
} = require("./roomHandAction.controller");
const auth = require("../../../middleware/auth");
const { requireRoomRoles } = require("../audioRoomAuthz");

router.post(
  "/hand-action",
  auth,
  requireRoomRoles(["host", "moderator", "admin"]),
  handleHandRequestActionController
);

module.exports =
  router;
