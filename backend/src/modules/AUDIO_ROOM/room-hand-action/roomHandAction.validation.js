const { z } = require('zod');

const RoomHandActionBodySchema = z.object({
  requestId: z.coerce.number().int().positive(),
  roomId: z.coerce.number().int().positive(),
  action: z.enum(['approve', 'reject']),
});

module.exports = {
  RoomHandActionBodySchema,
};
