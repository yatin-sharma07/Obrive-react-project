const { z } = require('zod');

const createVacationSchema = z.object({
        user_id     : z.string().uuid(),
        leave_type  : z.string().max(100),
        start_date  : z.date(),
        end_date    : z.date(),
        reason      : z.string().max(255),
        status      : z.enum(['pending', 'approved', 'rejected']).default('pending')
})

module.exports = { createVacationSchema };