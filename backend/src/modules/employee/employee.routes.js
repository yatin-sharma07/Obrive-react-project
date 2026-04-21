const router       = require('express').Router();
const ctrl         = require('./employee.controller');
const authenticate = require('../../middleware/auth');
const { authorize }= require('../../middleware/rbac');
const validate     = require('../../middleware/validate');
const { body, query } = require('express-validator');


router.post('/login', ctrl.login);  

router.use(authenticate);

// ── Profile 
router.get('/me',    authorize('employee'), ctrl.getMyProfile);
router.put('/me',    authorize('EMPLOYEE'), ctrl.updateMyProfile);

// ── Availability Calendar 
router.get('/availability',
  authorize('EMPLOYEE', 'HR', 'ADMIN'),
  ctrl.getMyAvailability
);

router.post('/availability',
  authorize('EMPLOYEE'),
  [
    body('date').isDate().withMessage('Valid date required (YYYY-MM-DD)'),
    body('startTime').matches(/^\d{2}:\d{2}$/).withMessage('startTime must be HH:MM'),
    body('endTime').matches(/^\d{2}:\d{2}$/).withMessage('endTime must be HH:MM'),
    body('slotType').isIn(['FREE', 'BUSY']).withMessage('slotType must be FREE or BUSY'),
  ],
  validate,
  ctrl.addAvailabilitySlot
);

router.put('/availability/:slotId',
  authorize('EMPLOYEE'),
  ctrl.updateAvailabilitySlot
);

router.delete('/availability/:slotId',
  authorize('EMPLOYEE'),
  ctrl.deleteAvailabilitySlot
);

// ── HR/Admin: view a specific employee's availability ────────
router.get('/:employeeId/availability',
  authorize('HR', 'ADMIN'),
  ctrl.getEmployeeAvailability
);

// ── My projects ──────────────────────────────────────────────
router.get('/my-projects', authorize('EMPLOYEE'), ctrl.getMyProjects);

// ── Login logs (own) ─────────────────────────────────────────
router.get('/my-logs', authorize('EMPLOYEE'), ctrl.getMyLogs);

module.exports = router;