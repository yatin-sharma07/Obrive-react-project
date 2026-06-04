const { z } = require('zod');

const StickyNoteIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const StickyNotesByDateQuerySchema = z.object({
  date: z.string().min(1, 'Date query parameter is required'),
});

const StickyNotesByRangeQuerySchema = z.object({
  startDate: z.string().min(1, 'startDate query parameter is required'),
  endDate: z.string().min(1, 'endDate query parameter is required'),
});

const StickyNotesByColorQuerySchema = z.object({
  color: z.string().min(1, 'Color query parameter is required'),
});

const StickyNoteBodyBaseSchema = z.object({
  content: z.string().trim().min(1, 'Content is required'),
  note_date: z.string().min(1, 'Valid date required'),
  color: z.string().optional(),
  position: z.coerce.number().int().optional(),
});

const CreateStickyNoteBodySchema = StickyNoteBodyBaseSchema;

const UpdateStickyNoteBodySchema = StickyNoteBodyBaseSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field is required' }
);

module.exports = {
  CreateStickyNoteBodySchema,
  StickyNoteIdParamSchema,
  StickyNotesByColorQuerySchema,
  StickyNotesByDateQuerySchema,
  StickyNotesByRangeQuerySchema,
  UpdateStickyNoteBodySchema,
};
