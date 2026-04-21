const { prisma } = require('../../config/db');

// ── Get all sticky notes for a user ──────────────────────────
exports.getAllStickyNotes = async (userId) => {
  const notes = await prisma.sticky_notes.findMany({
    where: { user_id: userId },
    orderBy: [{ note_date: 'desc' }, { position: 'asc' }],
  });
  return notes;
};

// ── Get sticky notes by date ─────────────────────────────────
exports.getStickyNotesByDate = async (userId, date) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const notes = await prisma.sticky_notes.findMany({
    where: {
      user_id: userId,
      note_date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { position: 'asc' },
  });
  return notes;
};

// ── Get sticky notes for a date range ────────────────────────
exports.getStickyNotesByDateRange = async (userId, startDate, endDate) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const notes = await prisma.sticky_notes.findMany({
    where: {
      user_id: userId,
      note_date: {
        gte: start,
        lte: end,
      },
    },
    orderBy: [{ note_date: 'desc' }, { position: 'asc' }],
  });
  return notes;
};

// ── Get sticky notes by color ────────────────────────────────
exports.getStickyNotesByColor = async (userId, color) => {
  const notes = await prisma.sticky_notes.findMany({
    where: {
      user_id: userId,
      color: color.toLowerCase(),
    },
    orderBy: [{ note_date: 'desc' }, { position: 'asc' }],
  });
  return notes;
};

// ── Get a single sticky note ─────────────────────────────────
exports.getStickyNoteById = async (noteId, userId) => {
  const note = await prisma.sticky_notes.findUnique({
    where: { id: noteId },
  });
  
  if (!note) throw { status: 404, message: 'Sticky note not found' };
  if (note.user_id !== userId) throw { status: 403, message: 'Unauthorized access' };
  
  return note;
};

// ── Create a sticky note ─────────────────────────────────────
exports.createStickyNote = async (userId, data) => {
  const { content, color = 'yellow', note_date, position = 0 } = data;

  if (!content) throw { status: 400, message: 'Content is required' };
  if (!note_date) throw { status: 400, message: 'Date is required' };

  const noteDate = new Date(note_date);
  noteDate.setHours(0, 0, 0, 0);

  const note = await prisma.sticky_notes.create({
    data: {
      user_id: userId,
      content,
      color: color.toLowerCase(),
      note_date: noteDate,
      position,
    },
  });
  return note;
};

// ── Update a sticky note ─────────────────────────────────────
exports.updateStickyNote = async (noteId, userId, data) => {
  const note = await prisma.sticky_notes.findUnique({
    where: { id: noteId },
  });

  if (!note) throw { status: 404, message: 'Sticky note not found' };
  if (note.user_id !== userId) throw { status: 403, message: 'Unauthorized access' };

  const updateData = {};
  if (data.content !== undefined) updateData.content = data.content;
  if (data.color !== undefined) updateData.color = data.color.toLowerCase();
  if (data.note_date !== undefined) {
    const noteDate = new Date(data.note_date);
    noteDate.setHours(0, 0, 0, 0);
    updateData.note_date = noteDate;
  }
  if (data.position !== undefined) updateData.position = data.position;
  updateData.updated_at = new Date();

  const updatedNote = await prisma.sticky_notes.update({
    where: { id: noteId },
    data: updateData,
  });
  return updatedNote;
};

// ── Delete a sticky note ─────────────────────────────────────
exports.deleteStickyNote = async (noteId, userId) => {
  const note = await prisma.sticky_notes.findUnique({
    where: { id: noteId },
  });

  if (!note) throw { status: 404, message: 'Sticky note not found' };
  if (note.user_id !== userId) throw { status: 403, message: 'Unauthorized access' };

  await prisma.sticky_notes.delete({
    where: { id: noteId },
  });
  return { message: 'Sticky note deleted successfully' };
};


