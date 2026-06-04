const { z } = require('zod');

const LiveKitTokenBodySchema = z.object({
  roomId: z.coerce.number().int().positive(),
});

module.exports = {
  LiveKitTokenBodySchema,
};
