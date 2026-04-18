// backend/src/modules/events/events.routes.js
const router = require('express').Router();
const authenticate = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');
const ctrl = require('./events.controller');


router.use(authenticate);


//public routes
router.get('/', ctrl.getAllEvents);
router.get('/nearest', ctrl.getNearestEvents);
router.get('/range', ctrl.getEventsByDateRange);

// HR-only routes 
router.post('/', authorize('hr'), ctrl.createEvent);
router.put('/:id', authorize('hr'), ctrl.updateEvent);
router.delete('/:id', authorize('hr'), ctrl.deleteEvent);

module.exports = router;