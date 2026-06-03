const router = require('express').Router();
const ctrl = require('./employee.controller');
const authenticate = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');
const zodValidate = require('../../middleware/zodValidate');
const { updateProfileSchema, availabilitySchema, slotIdParamSchema, employeeIdParamSchema } = require('./employee.validation');

router.post('/login', ctrl.login);

router.use(authenticate);

// Profile
router.get('/me', authorize('employee'), ctrl.getMyProfile);
router.put('/me', authorize('employee'), zodValidate({ part: 'body', schema: updateProfileSchema }), ctrl.updateMyProfile
);

// Availability
router.get('/availability', authorize('employee', 'hr', 'admin'), ctrl.getMyAvailability);
router.post('/availability',  authorize('employee'), zodValidate({ part: 'body', schema: availabilitySchema }), ctrl.addAvailabilitySlot
);

 

router.put('/availability/:slotId',
  authorize('employee'),
  zodValidate({ part: 'params', schema: slotIdParamSchema }),
  zodValidate({ part: 'body', schema: availabilitySchema }),
  ctrl.updateAvailabilitySlot
);

router.delete('/availability/:slotId',
  authorize('employee'),
  zodValidate({ part: 'params', schema: slotIdParamSchema }),
  ctrl.deleteAvailabilitySlot
);

// ── HR/Admin: view a specific employee's availability ────────
router.get('/:employeeId/availability',
  authorize('hr', 'admin'),
  zodValidate({ part: 'params', schema: employeeIdParamSchema }),
  ctrl.getEmployeeAvailability
);

// ── My projects ──────────────────────────────────────────────
router.get('/my-projects', authorize('employee'), ctrl.getMyProjects);

// ── Login logs (own) ─────────────────────────────────────────
router.get('/my-logs', authorize('employee'), ctrl.getMyLogs);

module.exports = router;