const { z } = require('zod');

const RoomRaiseHandBodySchema = z.object({
  roomId: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive().optional(),
}).passthrough();

module.exports = {
  RoomRaiseHandBodySchema,
};
