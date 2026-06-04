const { z } = require("zod");

const roleAssignmentSchema = z.object({
  assignmentType: z.enum(["specific-user", "crm-role"]),
  crmRole: z.string().optional().nullable(),
  assignedRoomRole: z.enum(["host", "moderator", "speaker", "listener"]),
  userId: z.coerce.number().int().positive().optional().nullable(),
}).passthrough();

const joinPermissionSchema = z.object({
  permissionType: z.enum(["guest", "crm-role"]),
  crmRole: z.string().optional().nullable(),
}).passthrough();

const notificationSchema = z.object({
  notificationType: z.string().min(1),
}).passthrough();

const roomConfigSchema = z.object({
  roomName: z.string().trim().min(1, "Room name is required").max(100),
  roomDescription: z.string().optional().nullable(),
  roomType: z.enum(["live", "scheduled"]),
  roomStatus: z.enum(["live", "scheduled", "ended"]).optional(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  participantLimit: z.coerce.number().int().min(1).max(10000),
  visibility: z.enum(["public", "private", "invite-only"]),
  allowGuestUsers: z.coerce.boolean(),
  redirectAfterRoomEnd: z.string().optional().nullable(),
}).passthrough();

const createRoomConfigSchema = z.object({
  roomConfig: roomConfigSchema,
  roleAssignments: z.array(roleAssignmentSchema).optional().default([]),
  joinPermissions: z.array(joinPermissionSchema).optional().default([]),
  notifications: z.array(notificationSchema).optional().default([]),
  invites: z.array(z.unknown()).optional().default([]),
}).passthrough();

module.exports = {
  createRoomConfigSchema,
};
