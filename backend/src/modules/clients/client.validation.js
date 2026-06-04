const { z } = require('zod');

const ClientLoginBodySchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
});

const ClientProjectIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const UpdateClientProfileBodySchema = z.object({
  name: z.string().min(1).optional(),
  dateOfBirth: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required',
});

const RequestProjectBodySchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().optional(),
});

module.exports = {
  ClientLoginBodySchema,
  ClientProjectIdParamSchema,
  RequestProjectBodySchema,
  UpdateClientProfileBodySchema,
};
