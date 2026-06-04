const { z } = require('zod');

const LeaveIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const LeaveDashboardQuerySchema = z.object({
  date: z.string().optional(),
});

const ApplyLeaveBodySchema = z.object({
  leaveType: z.enum(['vacation', 'sick']),
  leaveDate: z.string().min(1, 'leaveDate is required'),
  reason: z.string().optional(),
});

module.exports = {
  ApplyLeaveBodySchema,
  LeaveDashboardQuerySchema,
  LeaveIdParamSchema,
};
