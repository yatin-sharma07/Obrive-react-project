const { prisma } = require('../../../prisma');

// ── Get all sticky notes ──────────────────────────
exports.getAllStickyNotes = async (_userId) => {
  return await prisma.sticky_notes.findMany({
    include: {
      users: {
        select: { name: true }
      }
    },
    orderBy: [{ note_date: 'desc' }, { position: 'asc' }],
  });
};

// ── Get sticky notes by date ─────────────────────────────────
exports.getStickyNotesByDate = async (_userId, date) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  return await prisma.sticky_notes.findMany({
    where: {
      note_date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      users: {
        select: { name: true }
      }
    },
    orderBy: { position: 'asc' },
  });
};

// ── Get sticky notes for a date range ────────────────────────
exports.getStickyNotesByDateRange = async (_userId, startDate, endDate) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  return await prisma.sticky_notes.findMany({
    where: {
      note_date: {
        gte: start,
        lte: end,
      },
    },
    include: {
      users: {
        select: { name: true }
      }
    },
    orderBy: [{ note_date: 'desc' }, { position: 'asc' }],
  });
};

// ── Get sticky notes by color ────────────────────────────────
exports.getStickyNotesByColor = async (_userId, color) => {
  return await prisma.sticky_notes.findMany({
    where: {
      color: color.toLowerCase(),
    },
    include: {
      users: {
        select: { name: true }
      }
    },
    orderBy: [{ note_date: 'desc' }, { position: 'asc' }],
  });
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

  const noteDate = new Date(`${note_date}T00:00:00`);

  return await prisma.sticky_notes.create({
    data: {
      user_id: userId,
      content,
      color: color.toLowerCase(),
      note_date: noteDate,
      position,
    },
    include: {
      users: {
        select: { name: true }
      }
    }
  });
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
  const noteDate = new Date(`${data.note_date}T00:00:00`);
  updateData.note_date = noteDate;
}
  if (data.position !== undefined) updateData.position = data.position;

  updateData.updated_at = new Date();

  return await prisma.sticky_notes.update({
    where: { id: noteId },
    data: updateData,
  });
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