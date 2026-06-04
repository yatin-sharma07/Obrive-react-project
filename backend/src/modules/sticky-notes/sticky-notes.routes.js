const router       = require('express').Router(); // This file defines the routes for sticky notes and connects them to the controller functions.
const ctrl         = require('./sticky-notes.controller'); // Import the controller that contains the logic for handling sticky notes operations.It processes the requests and returns the responses. It interacts with the service layer to perform database operations and applies any necessary business logic.
const authenticate = require('../../middleware/auth'); // to ensure that the user is authenticated before accessing any sticky notes routes. It checks for a valid JWT token and attaches the user information to the request object if authentication is successful.
const { authorize } = require('../../middleware/rbac'); // to enforce role-based access control (RBAC) on the sticky notes routes. It checks if the authenticated user has one of the specified roles (EMPLOYEE, SUPERVISOR, HR, ADMIN, CLIENT) before allowing access to the route handlers.
const zodValidate = require('../../middleware/zodValidate');
const {
  CreateStickyNoteBodySchema,
  StickyNoteIdParamSchema,
  StickyNotesByColorQuerySchema,
  StickyNotesByDateQuerySchema,
  StickyNotesByRangeQuerySchema,
  UpdateStickyNoteBodySchema,
} = require('./sticky-notes.validation');


// ── Middleware ────────────────────────────────────────────────
router.use(authenticate);
router.use(authorize('employee', 'supervisor', 'hr', 'admin', 'client'));

// ── Get routes ────────────────────────────────────────────────
router.get('/', ctrl.getAllStickyNotes);

router.get('/by-date', 
  zodValidate({ part: 'query', schema: StickyNotesByDateQuerySchema }),
  ctrl.getStickyNotesByDate
);

router.get('/by-range',
  zodValidate({ part: 'query', schema: StickyNotesByRangeQuerySchema }),
  ctrl.getStickyNotesByDateRange
);

router.get('/by-color',
  zodValidate({ part: 'query', schema: StickyNotesByColorQuerySchema }),
  ctrl.getStickyNotesByColor
);

router.get('/:id',
  zodValidate({ part: 'params', schema: StickyNoteIdParamSchema }),
  ctrl.getStickyNoteById
);

// ── Create route ──────────────────────────────────────────────
router.post('/',
  zodValidate({ part: 'body', schema: CreateStickyNoteBodySchema }),
  ctrl.createStickyNote
);

// ── Update route ──────────────────────────────────────────────
router.put('/:id',
  zodValidate({ part: 'params', schema: StickyNoteIdParamSchema }),
  zodValidate({ part: 'body', schema: UpdateStickyNoteBodySchema }),
  ctrl.updateStickyNote
);

// ── Delete routes ─────────────────────────────────────────────
router.delete('/:id',
  zodValidate({ part: 'params', schema: StickyNoteIdParamSchema }),
  ctrl.deleteStickyNote
);

module.exports = router;
