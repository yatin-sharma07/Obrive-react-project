const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password required'),
});

const updateProfileSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().optional(),
});

const availabilityQuerySchema = z.object({
  date: z.string().optional(),
});

const availabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'startTime must be HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'endTime must be HH:MM'),
  slotType: z.enum(['FREE', 'BUSY']),
});

const slotIdParamSchema = z.object({
  slotId: z.coerce.number().int().positive(),
});

const employeeIdParamSchema = z.object({
  employeeId: z.coerce.number().int().positive(),
});

module.exports = {
  availabilityQuerySchema,
  availabilitySchema,
  employeeIdParamSchema,
  loginSchema,
  slotIdParamSchema,
  updateProfileSchema,
};
