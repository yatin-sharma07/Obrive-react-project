const { z } = require("zod");

const CreateTaskBodySchema = z.object({
  title         : z.string().min(1, "Title is required"),
  description   : z.string().optional(),
  deadline      : z.string().optional(),
  status        : z.enum([ "pending", "in_progress", "completed", "cancelled" ]).optional(),
  assigned_to   : z.coerce.number().positive().optional(),
}); 

const UpdateTaskBodySchema = z.object({
  title         : z.string().min(1).optional(),
  description   : z.string().nullable().optional(),
  deadline      : z.string().optional(),
  status        : z.enum([ "pending", "in_progress", "completed", "cancelled" ]).optional(),
  assigned_to   : z.coerce.number().positive().optional(),
});

const ProjectIdParamSchema = z.object({
  projectId     : z.coerce.number().positive(),
});

const TaskIdParamSchema = z.object({
  taskId        : z.coerce.number().positive(),
});

module.exports = {
  CreateTaskBodySchema,
  TaskIdParamSchema,
  UpdateTaskBodySchema,
  ProjectIdParamSchema,
};