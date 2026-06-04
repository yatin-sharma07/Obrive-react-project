const { z } = require('zod');

const SpeakerMuteBodySchema = z.object({
  roomId: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive(),
  isMuted: z.coerce.boolean(),
});

module.exports = {
  SpeakerMuteBodySchema,
};
