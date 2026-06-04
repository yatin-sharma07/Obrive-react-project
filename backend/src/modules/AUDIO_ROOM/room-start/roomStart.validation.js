const { z } = require('zod');

const RoomStartBodySchema = z.object({
  roomId: z.coerce.number().int().positive(),
});

module.exports = {
  RoomStartBodySchema,
};
