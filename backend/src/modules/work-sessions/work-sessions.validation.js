const { z } = require('zod');

const sessionIdSchema = z.object({
  sessionId: z.coerce.number().int().positive('sessionId must be a positive integer'),
});

module.exports = { sessionIdSchema };
