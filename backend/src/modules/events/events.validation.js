const { z } = require('zod');

const EventIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const NearestEventsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

const EventsByRangeQuerySchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
});

const EventBodyBaseSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.string().optional(),
  eventDate: z.string().min(1, 'Event date is required'),
  eventTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().optional(),
  eventType: z.string().optional(),
  isRecurring: z.coerce.boolean().optional(),
  repeatType: z.string().optional(),
  repeatDays: z.string().optional(),
  repeatEndDate: z.string().optional(),
});

const CreateEventBodySchema = EventBodyBaseSchema;

const UpdateEventBodySchema = EventBodyBaseSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field is required' }
);

module.exports = {
  CreateEventBodySchema,
  EventIdParamSchema,
  EventsByRangeQuerySchema,
  NearestEventsQuerySchema,
  UpdateEventBodySchema,
};
