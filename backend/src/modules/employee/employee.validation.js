const { z } = require('zod');

const updateProfileSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().optional(),
});

const availabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'startTime must be HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'endTime must be HH:MM'),
  slotType: z.enum(['FREE', 'BUSY']),
});

const slotIdParamSchema = z.object({
  slotId: z.string().min(1),
});

const employeeIdParamSchema = z.object({
  employeeId: z.string().min(1),
});

module.exports = { updateProfileSchema, availabilitySchema, slotIdParamSchema, employeeIdParamSchema };