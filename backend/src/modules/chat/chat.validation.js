const { z } = require('zod');

const ConversationIdParamSchema = z.object({
  conversationId: z.coerce.number().int().positive(),
});

const ConversationParticipantParamSchema = z.object({
  conversationId: z.coerce.number().int().positive(),
  userId: z.coerce.number().int().positive(),
});

const MessagesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

const CreateConversationBodySchema = z.object({
  type: z.enum(['direct', 'group']),
  name: z.string().optional(),
  participantIds: z.array(z.coerce.number().int().positive()).min(1),
});

const AddParticipantsBodySchema = z.object({
  participantIds: z.array(z.coerce.number().int().positive()).min(1),
});

const DeleteConversationQuerySchema = z.object({
  type: z.enum(['self', 'permanent']).optional(),
});

module.exports = {
  AddParticipantsBodySchema,
  ConversationIdParamSchema,
  ConversationParticipantParamSchema,
  CreateConversationBodySchema,
  DeleteConversationQuerySchema,
  MessagesQuerySchema,
};
