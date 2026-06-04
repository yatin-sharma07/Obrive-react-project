const { z } = require('zod');

const EmployeeIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const SearchEmployeesQuerySchema = z.object({
  q: z.string().trim().min(1, 'Search term required'),
});

const UpdateHrProfileBodySchema = z.object({
  name: z.string().min(1).optional(),
  bio: z.string().optional(),
  dateOfBirth: z.string().optional(),
  phone: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required',
});

const UpdateEmployeeBodySchema = z.object({
  name: z.string().min(1).optional(),
  department: z.string().optional(),
  jobTitle: z.string().optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required',
});

module.exports = {
  EmployeeIdParamSchema,
  SearchEmployeesQuerySchema,
  UpdateEmployeeBodySchema,
  UpdateHrProfileBodySchema,
};
