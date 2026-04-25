const service = require('./sticky-notes.service');
const { successResponse } = require('../../utils/apiResponse');

// ── Get all sticky notes ─────────────────────────────────────
exports.getAllStickyNotes = async (req, res, next) => {
  try {
    successResponse(res, await service.getAllStickyNotes(req.user.id));
  } catch (err) {
    next(err);
  }
};

// ── Get sticky notes by date ─────────────────────────────────
exports.getStickyNotesByDate = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) throw { status: 400, message: 'Date query parameter is required' };
    
    successResponse(res, await service.getStickyNotesByDate(req.user.id, date));
  } catch (err) {
    next(err);
  }
};

// ── Get sticky notes by date range ──────────────────────────
exports.getStickyNotesByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw {
        status: 400,
        message: 'startDate and endDate query parameters are required',
      };
    }

    const data = await service.getStickyNotesByDateRange(
      req.user.id,
      startDate,
      endDate
    );

   

    successResponse(res, data); // send AFTER logging
  } catch (err) {
    next(err);
  }
};

// ── Get sticky notes by color ────────────────────────────────
exports.getStickyNotesByColor = async (req, res, next) => {
  try {
    const { color } = req.query;
    if (!color) throw { status: 400, message: 'Color query parameter is required' };
    
    successResponse(res, await service.getStickyNotesByColor(req.user.id, color));
  } catch (err) {
    next(err);
  }
};

// ── Get a single sticky note ─────────────────────────────────
exports.getStickyNoteById = async (req, res, next) => {
  try {
    successResponse(res, await service.getStickyNoteById(parseInt(req.params.id), req.user.id));
  } catch (err) {
    next(err);
  }
};

// ── Create a sticky note ─────────────────────────────────────
exports.createStickyNote = async (req, res, next) => {
  try {
    successResponse(res, await service.createStickyNote(req.user.id, req.body), 'Sticky note created', 201);
  } catch (err) {
    next(err);
  }
};

// ── Update a sticky note ─────────────────────────────────────
exports.updateStickyNote = async (req, res, next) => {
  try {
    successResponse(res, await service.updateStickyNote(parseInt(req.params.id), req.user.id, req.body), 'Sticky note updated');
  } catch (err) {
    next(err);
  }
};

// ── Delete a sticky note ─────────────────────────────────────
exports.deleteStickyNote = async (req, res, next) => {
  try {
    successResponse(res, await service.deleteStickyNote(parseInt(req.params.id), req.user.id), 'Sticky note deleted');
  } catch (err) {
    next(err);
  }
};

