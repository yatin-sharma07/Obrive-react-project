const { z } = require('zod');

const ParticipantRemoveBodySchema = z.object({
  roomId: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive(),
});

module.exports = {
  ParticipantRemoveBodySchema,
};
