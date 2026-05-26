const express =
  require("express");

const router =
  express.Router();

const {
  getPendingHandRequestsController,
} = require("./roomHandRequests.controller");
const auth = require("../../../middleware/auth");
const { requireRoomRoles } = require("../audioRoomAuthz");

router.get(
  "/hand-requests/:roomId",
  auth,
  requireRoomRoles(["host", "moderator", "admin"]),
  getPendingHandRequestsController
);

module.exports =
  router;
