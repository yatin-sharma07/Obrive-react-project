const { z } = require('zod');

const UserIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const CreateEmployeeBodySchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Min 6 characters'),
  fullName: z.string().min(1, 'Full name required'),
  phone: z.string().optional(),
  department: z.string().optional(),
  designation: z.string().optional(),
  dateJoined: z.string().optional(),
});

const CreateHrBodySchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Min 6 characters'),
  fullName: z.string().min(1, 'Full name required'),
  phone: z.string().optional(),
});

const CreateClientBodySchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Min 6 characters'),
  companyName: z.string().min(1, 'Company name required'),
  contactName: z.string().min(1, 'Contact name required'),
  phone: z.string().optional(),
  industry: z.string().optional(),
});

const LogsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

module.exports = {
  CreateClientBodySchema,
  CreateEmployeeBodySchema,
  CreateHrBodySchema,
  LogsQuerySchema,
  UserIdParamSchema,
};
