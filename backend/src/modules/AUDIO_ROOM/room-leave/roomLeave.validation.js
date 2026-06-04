const { z } = require('zod');

const RoomLeaveBodySchema = z.object({
  roomId: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive().optional(),
}).passthrough();

module.exports = {
  RoomLeaveBodySchema,
};
