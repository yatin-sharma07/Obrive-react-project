const { z } = require('zod');

const LoginBodySchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

const ClientLoginBodySchema = z.object({
  clientId: z.string().min(1, 'Client ID required'),
  password: z.string().min(1, 'Password required'),
});

module.exports = {
  ClientLoginBodySchema,
  LoginBodySchema,
};
