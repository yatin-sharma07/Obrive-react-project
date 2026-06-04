const { z } = require('zod');

const UpdateProfileSchema = z.object({
  fullName  : z.string().min(1),
  email     : z.string().email(),
  department: z.string(),
  jobTitle  : z.string(),
  phoneNumber: z.coerce.number().int().positive().min(10).max(9999999999999),
  joinDate  : z.string(),
  biography : z.string(),
}).partial().refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field is required',
}); 

const ProfileIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

module.exports = { UpdateProfileSchema, ProfileIdSchema };
