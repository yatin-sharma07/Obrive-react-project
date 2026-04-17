const router       = require('express').Router();
const ctrl         = require('./admin.controller');
const authenticate = require('../../middleware/auth');
const { authorize }= require('../../middleware/rbac');
const validate     = require('../../middleware/validate');
const { body }     = require('express-validator');

// Create Employee (ADMIN + HR) 
router.post('/users/employee',
  authenticate,
  authorize('ADMIN', 'HR'),
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Min 6 characters'),
    body('fullName').notEmpty().withMessage('Full name required'),
  ],
  validate,
  ctrl.createEmployee
);

// Create HR (ADMIN only) 
router.post('/users/hr',
  authenticate,
  authorize('ADMIN'),
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Min 6 characters'),
    body('fullName').notEmpty().withMessage('Full name required'),
  ],
  validate,
  ctrl.createHr
);

// Create Client (ADMIN + HR) 
router.post('/users/client',
  authenticate,
  authorize('ADMIN', 'HR'),
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Min 6 characters'),
    body('companyName').notEmpty().withMessage('Company name required'),
    body('contactName').notEmpty().withMessage('Contact name required'),
  ],
  validate,
  ctrl.createClient
);

//  Toggle active (ADMIN + HR) 
router.put('/users/:id/toggle-active',
  authenticate,
  authorize('ADMIN', 'HR'),
  ctrl.toggleUserActive
);

// Delete user (ADMIN only) 
router.delete('/users/:id',
  authenticate,
  authorize('ADMIN'),
  ctrl.deleteUser
);

// View all users (ADMIN + HR) 
router.get('/users',
  authenticate,
  authorize('ADMIN', 'HR'),
  ctrl.getAllUsers
);

// Logs & Stats (ADMIN only) 
router.get('/logs',
  authenticate,
  authorize('ADMIN'),
  ctrl.getAllLogs
);

router.get('/stats',
  authenticate,
  authorize('ADMIN'),
  ctrl.getDashboardStats
);

module.exports = router;