const { z } = require('zod');

const RoomJoinBodySchema = z.object({
  roomId: z.coerce.number().int().positive(),
  passkey: z.string().optional(),
});

module.exports = {
  RoomJoinBodySchema,
};
