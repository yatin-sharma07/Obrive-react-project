/**
 * ROOM CONFIG VALIDATION SCHEMA
 * 
 * This file defines the Zod schema that validates all room configuration data
 * BEFORE it gets saved to the database.
 * 
 * WHY VALIDATE?
 * - Ensures data integrity (correct types)
 * - Prevents invalid data from being saved
 * - Provides clear error messages to frontend
 * - Makes database schema predictable
 * 
 * WHEN IS THIS USED?
 * controller.js calls: createRoomConfigSchema.safeParse(roomData)
 * If validation fails → return 400 error to frontend
 * If validation passes → send to service.js for saving
 */

const { z } = require("zod");

/**
 * CREATE ROOM CONFIG VALIDATION SCHEMA
 * 
 * This Zod schema defines what a valid room configuration looks like.
 * Each field has validation rules that must be satisfied.
 */
const createRoomConfigSchema =
  z.object({
    /**
     * ROOM NAME - Required text field
     * Rules:
     * - Must be a string
     * - .trim() removes whitespace from start/end
     * - Minimum 5 characters
     * - Maximum 100 characters
     * 
     * Example: "Team Meeting Room", "Client Presentation"
     */
    roomName: z
      .string()
      .trim()
      .min(
        5,
        "Room name must be at least 5 characters"
      )
      .max(
        100,
        "Room name cannot exceed 100 characters"
      ),

    /**
     * ROOM DESCRIPTION - Optional text field
     * Rules:
     * - Must be a string (if provided)
     * - Can be omitted from frontend request
     * 
     * Example: "Weekly sync with the product team"
     */
    roomDescription:
      z.string().optional(),

    /**
     * ROOM TYPE - Required enum (fixed set of options)
     * Rules:
     * - Must be EXACTLY "live" or "scheduled"
     * - "live" = room starts immediately
     * - "scheduled" = room has a start time
     * 
     * Example: "live"
     */
    roomType: z.enum([
      "live",
      "scheduled",
    ]),

    /**
     * START TIME - Optional timestamp
     * Rules:
     * - Must be a string (ISO format recommended)
     * - Can be omitted if roomType is "live"
     * - Required if roomType is "scheduled"
     * 
     * Example: "2026-05-15T14:30:00Z"
     */
    startTime: z
      .string()
      .optional(),

    /**
     * PARTICIPANT LIMIT - Required number
     * Rules:
     * - Must be a number (integer)
     * - Minimum 1 participant
     * - Maximum 10,000 participants
     * - Controls how many people can join the room
     * 
     * Example: 50
     */
    participantLimit:
      z.number()
        .min(
          1,
          "Minimum participants must be 1"
        )
        .max(
          10000,
          "Maximum limit exceeded"
        ),

    /**
     * VISIBILITY - Required enum
     * Rules:
     * - Must be EXACTLY "public", "private", or "invite-only"
     * - "public" = anyone can see and join
     * - "private" = only invited users can join
     * - "invite-only" = needs invitation or passcode
     * 
     * Example: "private"
     */
    visibility:
      z.enum([
        "public",
        "private",
        "invite-only",
      ]),

    /**
     * WHO CAN HOST - Required array of user IDs
     * Rules:
     * - Must be an array of strings
     * - Each string is a user ID who has host permissions
     * - Empty array = no one can host (not recommended)
     * 
     * Example: ["user123", "user456"]
     */
    whoCanHost:
      z.array(z),

    /**
     * WHO CAN MODERATE - Required array of user IDs
     * Rules:
     * - Must be an array of strings
     * - Each string is a user ID who can moderate (mute, remove users, etc.)
     * - Can overlap with whoCanHost
     * 
     * Example: ["user123", "user789"]
     */
    whoCanModerate:
      z.array(z.string()),

    /**
     * WHO CAN SPEAK - Required array of user IDs
     * Rules:
     * - Must be an array of strings
     * - Each string is a user ID who can unmute/speak
     * - Users not in this list are "listen-only"
     * 
     * Example: ["user123", "user456", "user789"]
     */
    whoCanSpeak:
      z.array(z.string()),

    /**
     * WHO CAN JOIN - Required array of user IDs
     * Rules:
     * - Must be an array of strings
     * - Users not in this list cannot join at all
     * - Works with visibility setting for access control
     * 
     * Example: ["user123", "user456", "user789", "user101"]
     */
    whoCanJoin:
      z.array(z.string()),

    /**
     * ALLOW GUEST USERS - Required boolean
     * Rules:
     * - Must be true or false
     * - true = guests can join without login
     * - false = only registered users can join
     * 
     * Example: true
     */
    allowGuestUsers:
      z.boolean(),
  });

module.exports = {
  createRoomConfigSchema,
};