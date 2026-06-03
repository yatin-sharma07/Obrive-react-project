const { z } = require('zod');

const UpdateProfileSchema = z.object({
  fullName  : z.string().min(1),
  email     : z.string().email(),
  department: z.string(),
  jobTitle  : z.string(),
  phoneNumber: z.number().int().positive().min(10).max(13), // Assuming a 10-digit phone number
  joinDate  : z.string(),
  biography : z.string(),
}); 

const ProfileIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

module.exports = { UpdateProfileSchema, ProfileIdSchema };