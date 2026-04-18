const router       = require('express').Router();
const controller   = require('./auth.controller');
const validate     = require('../../middleware/validate');
const authenticate = require('../../middleware/auth');
const { body }     = require('express-validator');

// Employee / HR / Admin login
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  validate,
  controller.loginUser
);

// Client login
router.post('/client/login',
  [
    body('clientId').notEmpty().withMessage('Client ID required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  validate,
  controller.loginClient
);

router.post('/logout',  authenticate, controller.logout);
router.post('/refresh', controller.refreshToken);
router.get('/users', authenticate, controller.getAllUsers);
module.exports = router;

