const { z } = require('zod');

const MeetingIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const ScheduleMeetingBodySchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().optional(),
  projectId: z.coerce.number().int().positive().optional(),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'startTime must be HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'endTime must be HH:MM'),
  participantIds: z.array(z.coerce.number().int().positive()).min(1, 'At least one participant required'),
});

const UpdateMeetingStatusBodySchema = z.object({
  status: z.string().min(1, 'Status is required'),
});

module.exports = {
  MeetingIdParamSchema,
  ScheduleMeetingBodySchema,
  UpdateMeetingStatusBodySchema,
};
