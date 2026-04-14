const router       = require('express').Router();
const ctrl         = require('./onboarding.controller');
const authenticate = require('../../middleware/auth');
const validate     = require('../../middleware/validate');
const { body }     = require('express-validator');

// Send OTP 
router.post('/send-otp',
  [body('phone').notEmpty().withMessage('Phone number required')],
  validate,
  ctrl.sendOtp
);

//  Verify OTP + create account 
router.post('/verify-otp',
  [
    body('phone').notEmpty(),
    body('otp').isLength({ min: 4, max: 4 }).withMessage('OTP must be 4 digits'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Min 6 characters'),
  ],
  validate,
  ctrl.verifyOtpAndRegister
);

// Tell about yourself 
router.post('/about-yourself',
  authenticate,
  [
    body('useCase').notEmpty().withMessage('Use case required'),
    body('describes').notEmpty().withMessage('Description required'),
  ],
  validate,
  ctrl.aboutYourself
);

// Tell about company 
router.post('/company',
  authenticate,
  [
    body('companyName').notEmpty().withMessage('Company name required'),
    body('businessDirection').notEmpty(),
    body('teamSize').notEmpty(),
  ],
  validate,
  ctrl.companyInfo
);

// Invite team members 
router.post('/invite-members',
  authenticate,
  [
    body('emails').isArray({ min: 1 }).withMessage('At least one email required'),
    body('emails.*').isEmail().withMessage('Each entry must be a valid email'),
  ],
  validate,
  ctrl.inviteMembers
);

// Accept invite (from email link) 
router.get('/accept-invite/:token', ctrl.acceptInvite);

module.exports = router;