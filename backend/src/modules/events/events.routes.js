// backend/src/modules/events/events.routes.js
const router = require('express').Router();
const authenticate = require('../../middleware/auth');
const { authorize } = require('../../middleware/rbac');
const ctrl = require('./events.controller');
const zodValidate = require('../../middleware/zodValidate');
const {
  CreateEventBodySchema,
  EventIdParamSchema,
  EventsByRangeQuerySchema,
  NearestEventsQuerySchema,
  UpdateEventBodySchema,
} = require('./events.validation');


router.use(authenticate);


//public routes
router.get('/', ctrl.getAllEvents);
router.get('/nearest', zodValidate({ part: 'query', schema: NearestEventsQuerySchema }), ctrl.getNearestEvents);
router.get('/range', zodValidate({ part: 'query', schema: EventsByRangeQuerySchema }), ctrl.getEventsByDateRange);

// HR and Supervisor routes 
router.post('/', authorize('hr', 'supervisor'), zodValidate({ part: 'body', schema: CreateEventBodySchema }), ctrl.createEvent);
router.put(
  '/:id',
  authorize('hr', 'supervisor'),
  zodValidate({ part: 'params', schema: EventIdParamSchema }),
  zodValidate({ part: 'body', schema: UpdateEventBodySchema }),
  ctrl.updateEvent
);
router.delete('/:id', authorize('hr', 'supervisor'), zodValidate({ part: 'params', schema: EventIdParamSchema }), ctrl.deleteEvent);

module.exports = router;
