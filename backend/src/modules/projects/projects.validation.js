const { z } = require('zod');

const ProjectIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const ProjectAssignmentParamSchema = z.object({
  id: z.coerce.number().int().positive(),
  employeeId: z.coerce.number().int().positive(),
});

const ProjectBodyBaseSchema = z.object({
  name: z.string().trim().min(1, 'Project name is required'),
  description: z.string().optional(),
  priority: z.string().optional(),
  project_id: z.string().optional(),
  deadline: z.string().optional(),
  client_id: z.preprocess(
    (value) => (value === '' || value == null ? undefined : String(value)),
    z.string().trim().min(1).optional()
  ),
  leader_id: z.coerce.number().int().positive().nullable().optional(),
  progress: z.coerce.number().int().min(0).max(100).optional(),
  status: z.string().optional(),
  project_status: z.string().optional(),
  team_members: z.array(z.coerce.number().int().positive()).optional(),
});

const CreateProjectBodySchema = ProjectBodyBaseSchema;

const UpdateProjectBodySchema = ProjectBodyBaseSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field is required' }
);

const AssignProjectLeaderBodySchema = z.object({
  leaderId: z.coerce.number().int().positive(),
});

const AssignEmployeeBodySchema = z.object({
  employeeId: z.coerce.number().int().positive(),
});

const UpdateProjectProgressBodySchema = z.object({
  progress: z.coerce.number().int().min(0).max(100),
});

module.exports = {
  AssignEmployeeBodySchema,
  AssignProjectLeaderBodySchema,
  CreateProjectBodySchema,
  ProjectAssignmentParamSchema,
  ProjectIdParamSchema,
  UpdateProjectProgressBodySchema,
  UpdateProjectBodySchema,
};
