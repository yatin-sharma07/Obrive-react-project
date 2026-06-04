const router = require('express').Router();
const controller = require('./profile.controller');
const authenticate = require('../../middleware/auth'); 
const zodValidate = require('../../middleware/zodValidate'); // input validation middleware, it validates incoming request data 
const { ProfileIdSchema, UpdateProfileSchema } = require('./profile.validation');

router.use(authenticate); 

router.get('/:id', zodValidate({ part: 'params', schema: ProfileIdSchema }), controller.getProfileById);
router.put(
  '/:id',
  zodValidate({ part: 'params', schema: ProfileIdSchema }),
  zodValidate({ part: 'body', schema: UpdateProfileSchema }),
  controller.updateProfileById
);

module.exports = router;
