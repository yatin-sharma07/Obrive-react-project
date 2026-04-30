const router = require('express').Router();
const controller = require('./profile.controller');
const authenticate = require('../../middleware/auth');

router.use(authenticate);

router.get('/:id', controller.getProfileById);
router.put('/:id', controller.updateProfileById);

module.exports = router;
