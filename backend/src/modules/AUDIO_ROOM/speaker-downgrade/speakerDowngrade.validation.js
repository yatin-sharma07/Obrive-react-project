const { z } = require('zod');

const SpeakerDowngradeBodySchema = z.object({
  roomId: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive(),
});

module.exports = {
  SpeakerDowngradeBodySchema,
};
