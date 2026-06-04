const { z } = require('zod');

const CreateVacationSchema = z.object({
  leave_type: z.string().trim().min(1, 'leave_type is required').max(100),
  start_date: z.string().min(1, 'start_date is required'),
  end_date: z.string().min(1, 'end_date is required'),
  reason: z.string().max(255).optional(),
});

module.exports = {
  CreateVacationSchema,
};
