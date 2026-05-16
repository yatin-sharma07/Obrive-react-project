/**
 * ROOM CONFIG CONTROLLER
 * 
 * This controller handles HTTP requests for creating room configurations.
 * It acts as the "gatekeeper" that:
 * 1. Receives data from the frontend (via req.body)
 * 2. Validates the data using Zod schemas
 * 3. Passes valid data to the service layer for processing
 * 4. Returns responses (success or error) to the frontend
 */

const { createRoomConfigService } = require("./roomConfig.service");
const { createRoomConfigSchema } = require("./roomConfig.validation");

/**
 * CREATE ROOM CONFIG HANDLER
 * @param {Object} req - Express request object containing:
 *   - req.body = room configuration data from frontend
 * @param {Object} res - Express response object to send data back
 * 
 * FLOW:
 * Frontend (CreateRoom.tsx) → POST /api/audio-room/create → This Handler
 */
const createRoomConfig = async (req, res) => {
  try {
    // STEP 1: Extract room data from request body
    // Example: { roomName: "Team Meeting", roomType: "live", participantLimit: 50, ... }
    const roomData = req.body;

    // STEP 2: Validate the incoming data using Zod schema
    // safeParse returns { success: true/false, data: {...}, error: {...} }
    // This ensures data meets requirements (right types, lengths, enums, etc.)
    const validation = createRoomConfigSchema.safeParse(roomData);
    
    // If validation fails, return 400 (Bad Request) with error details
    if (!validation.success) {
      // Zod error structure: validation.error.issues (not errors!)
      // Log raw error for debugging
      console.error("❌ Validation failed - Raw error:", validation.error);
      
      // Format Zod errors into readable messages
      const formattedErrors = (validation.error?.issues || []).map(err => ({
        field: Array.isArray(err.path) ? err.path.join('.') : 'unknown', 
        message: err.message,
        code: err.code,
      }));
      
      console.error("❌ Formatted errors:", formattedErrors);
      
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors,
      });
    }

    // STEP 3: Call the service layer to process the validated data
    // The service layer handles business logic (database save, transformations, etc.)
    const result = await createRoomConfigService(validation.data);

    // STEP 4: Return success response with 201 (Created) status
    // Frontend can now use this room config data
    return res.status(201).json({
      success: true,
      message: "Room configuration created successfully",
      data: result, // Contains the saved room config with ID, timestamps, etc.
    });
    
  } catch (error) {
    // STEP 5: Handle unexpected errors
    console.error("Create Room Config Error:", error);

    // Return 500 (Internal Server Error) if something goes wrong
    return res.status(500).json({
      success: false,
      message: "Failed to create room configuration",
      error: error.message,
    });
  }
};

module.exports = {
  createRoomConfig,
};