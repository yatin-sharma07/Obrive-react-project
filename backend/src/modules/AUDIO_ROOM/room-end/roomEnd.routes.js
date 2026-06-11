const express = require("express");
const router = express.Router();

const { endRoomController } = require("./roomEnd.controller");
const auth = require("../../../middleware/auth");
const zodValidate = require("../../../middleware/zodValidate");
const { requireRoomRoles } = require("../audioRoomAuthz");
const { RoomEndBodySchema } = require("./roomEnd.validation"); 

router.post(
  "/end-room",
  auth,
  zodValidate({ part: "body", schema: RoomEndBodySchema }),
  requireRoomRoles(["host", "admin"]), // Checks local participant arrays
  endRoomController
); 

router.post(
  "/admin/end-room",
  auth, // Verifies token integrity and populates req.user
  (req, res, next) => {
    // Structural Guard: Validate global platform administration access clears
    if (req.user && (req.user.role === "admin" || req.user.role === "supervisor")) {
      return next(); // Bypasses room participant array lookups entirely
    }
    return res.status(403).json({ 
      success: false, 
      message: "Forbidden: This action requires platform administration access privileges." 
    });
  },
  zodValidate({ part: "body", schema: RoomEndBodySchema }),
  endRoomController
);

module.exports = router;