const express = require("express"); // Import Express framework
const router = express.Router();     // Create a router instance for this module

// STEP 1: Import the controller that handles the logic
const { createRoomConfig } = require("./roomConfig.controller");

/**
 * STEP 2: Define API endpoints
 * 
 * Format: router.METHOD(PATH, HANDLER)
 * - METHOD: HTTP method (post, get, put, delete, etc.)
 * - PATH: The endpoint path (relative to the base /api/audio-room)
 * - HANDLER: The controller function to execute
 */

// CREATE ENDPOINT
// POST http://localhost:5000/api/audio-room/create
// Frontend calls this when user submits CreateRoom form
// Controller receives data → validates → saves → returns response
router.post("/create", createRoomConfig);

/**
 * FUTURE ENDPOINTS (to implement):
 * 
 * // GET all rooms for current user
 * router.get("/", getRoomConfigs);
 * 
 * // GET specific room by ID
 * router.get("/:id", getRoomConfig);
 * 
 * // UPDATE room configuration
 * router.put("/:id", updateRoomConfig);
 * 
 * // DELETE room
 * router.delete("/:id", deleteRoomConfig);
 */

// STEP 3: Export the router to be used in server.js
module.exports = router;