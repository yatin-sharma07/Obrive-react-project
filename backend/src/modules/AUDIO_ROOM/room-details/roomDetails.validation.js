const { z } = require('zod');

const RoomIdParamSchema = z.object({
  roomId: z.coerce.number().int().positive(),
});

module.exports = {
  RoomIdParamSchema,
};
