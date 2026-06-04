const { z } = require('zod');

const RoomEndBodySchema = z.object({
  roomId: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive().optional(),
});

module.exports = {
  RoomEndBodySchema,
};
