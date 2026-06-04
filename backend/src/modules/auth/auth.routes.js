const router       = require('express').Router();
const controller   = require('./auth.controller');
const authenticate = require('../../middleware/auth');
const zodValidate  = require('../../middleware/zodValidate');
const {
  ClientLoginBodySchema,
  LoginBodySchema,
} = require('./auth.validation');

// Employee / HR / Admin login
router.post('/login',
  zodValidate({ part: 'body', schema: LoginBodySchema }),
  controller.loginUser
);

// Client login
router.post('/client/login',
  zodValidate({ part: 'body', schema: ClientLoginBodySchema }),
  controller.loginClient
);

router.post('/logout',  authenticate, controller.logout);
router.post('/refresh', controller.refreshToken);
router.get('/me', authenticate, controller.getCurrentUser);
router.get('/users', authenticate, controller.getAllUsers);
module.exports = router;

