const { z } = require('zod');

const CalendarTaskIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const CalendarTasksQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const CreateCalendarTaskBodySchema = z.object({
  title: z.string().trim().min(1, 'Task title is required'),
  description: z.string().optional(),
  deadline: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).optional(),
  assigned_to: z.coerce.number().int().positive().nullable().optional(),
  created_by: z.coerce.number().int().positive().nullable().optional(),
  project_id: z.coerce.number().int().positive().nullable().optional(),
  task_number: z.string().optional(),
});

const UpdateCalendarTaskBodySchema = CreateCalendarTaskBodySchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field is required' }
);

module.exports = {
  CalendarTaskIdParamSchema,
  CalendarTasksQuerySchema,
  CreateCalendarTaskBodySchema,
  UpdateCalendarTaskBodySchema,
};
