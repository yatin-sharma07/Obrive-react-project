const router       = require('express').Router(); // This file defines the routes for sticky notes and connects them to the controller functions.
const ctrl         = require('./sticky-notes.controller'); // Import the controller that contains the logic for handling sticky notes operations.It processes the requests and returns the responses. It interacts with the service layer to perform database operations and applies any necessary business logic.
const authenticate = require('../../middleware/auth'); // to ensure that the user is authenticated before accessing any sticky notes routes. It checks for a valid JWT token and attaches the user information to the request object if authentication is successful.
const { authorize } = require('../../middleware/rbac'); // to enforce role-based access control (RBAC) on the sticky notes routes. It checks if the authenticated user has one of the specified roles (EMPLOYEE, HR, ADMIN, CLIENT) before allowing access to the route handlers.
const { body, query, param } = require('express-validator'); // to 


// ── Middleware ────────────────────────────────────────────────
router.use(authenticate);
router.use(authorize('employee', 'hr', 'admin', 'client'));

// ── Get routes ────────────────────────────────────────────────
router.get('/', ctrl.getAllStickyNotes);

router.get('/by-date', 
  query('date').isISO8601().withMessage('Valid date required (YYYY-MM-DD)'), // isISO8601 means that 
  ctrl.getStickyNotesByDate
);

router.get('/by-range',
  query('startDate').isISO8601().withMessage('Valid startDate required (YYYY-MM-DD)'),
  query('endDate').isISO8601().withMessage('Valid endDate required (YYYY-MM-DD)'),
  ctrl.getStickyNotesByDateRange
);

router.get('/by-color',
  query('color').isString().notEmpty().withMessage('Color is required'),
  ctrl.getStickyNotesByColor
);

router.get('/:id',
  param('id').isInt().withMessage('Valid note ID required'),
  ctrl.getStickyNoteById
);

// ── Create route ──────────────────────────────────────────────
router.post('/',
  body('content').notEmpty().withMessage('Content is required'),
  body('note_date').isISO8601().withMessage('Valid date required (YYYY-MM-DD)'),
  body('color').optional().isString().withMessage('Color must be a string'),
  body('position').optional().isInt().withMessage('Position must be an integer'),
  ctrl.createStickyNote
);

// ── Update route ──────────────────────────────────────────────
router.put('/:id',
  param('id').isInt().withMessage('Valid note ID required'),
  body('content').optional().notEmpty().withMessage('Content cannot be empty'),
  body('note_date').optional().isISO8601().withMessage('Valid date required (YYYY-MM-DD)'),
  body('color').optional().isString().withMessage('Color must be a string'),
  body('position').optional().isInt().withMessage('Position must be an integer'),
  ctrl.updateStickyNote
);

// ── Delete routes ─────────────────────────────────────────────
router.delete('/:id',
  param('id').isInt().withMessage('Valid note ID required'),
  ctrl.deleteStickyNote
);

module.exports = router;
