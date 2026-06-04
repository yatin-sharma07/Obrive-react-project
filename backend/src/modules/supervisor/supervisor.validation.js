const { z } = require('zod');

const EmployeeIdParamSchema = z.object({
  employeeId: z.coerce.number().int().positive(),
});

const LeaveIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const UpdateLeaveStatusBodySchema = z.object({
  status: z.enum(['approved', 'rejected', 'pending']),
});

const AddUserBodySchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password is required'),
  role: z.string().min(1, 'Role is required'),
  name: z.string().optional(),
  userid: z.string().optional(),
});

module.exports = {
  AddUserBodySchema,
  EmployeeIdParamSchema,
  LeaveIdParamSchema,
  UpdateLeaveStatusBodySchema,
};
