const { prisma } = require('../../config/db');

// ── Profile ──────────────────────────────────────────────────
exports.getMyProfile = async (userId) => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  return user;
};

exports.updateMyProfile = async (userId, data) => {
  const employee = await prisma.employee.findUnique({ where: { userId } });
  if (!employee) throw { status: 404, message: 'Employee not found' };

  return prisma.employee.update({
    where: { userId },
    data:  { fullName: data.fullName, phone: data.phone, department: data.department },
  });
};

// ── Availability ─────────────────────────────────────────────
exports.getAvailability = async (employeeId, date) => {
  const where = { employeeId };
  if (date) where.date = new Date(date);

  return prisma.availabilitySlot.findMany({
    where,
    orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
  });
};

exports.addAvailabilitySlot = async (userId, data) => {
  const employee = await prisma.employee.findUnique({ where: { userId } });
  if (!employee) throw { status: 404, message: 'Employee not found' };

  // Prevent overlapping slots on same date
  const existing = await prisma.availabilitySlot.findMany({
    where: { employeeId: employee.id, date: new Date(data.date) },
  });

  const overlap = existing.some(slot =>
    data.startTime < slot.endTime && data.endTime > slot.startTime
  );
  if (overlap) throw { status: 409, message: 'Time slot overlaps with an existing slot' };

  return prisma.availabilitySlot.create({
    data: {
      employeeId: employee.id,
      date:       new Date(data.date),
      startTime:  data.startTime,
      endTime:    data.endTime,
      slotType:   data.slotType,
      note:       data.note,
    },
  });
};

exports.updateAvailabilitySlot = async (slotId, userId, data) => {
  const employee = await prisma.employee.findUnique({ where: { userId } });
  const slot     = await prisma.availabilitySlot.findUnique({ where: { id: slotId } });

  if (!slot || slot.employeeId !== employee.id)
    throw { status: 403, message: 'Not authorized to edit this slot' };

  return prisma.availabilitySlot.update({
    where: { id: slotId },
    data:  { startTime: data.startTime, endTime: data.endTime, slotType: data.slotType, note: data.note },
  });
};

exports.deleteAvailabilitySlot = async (slotId, userId) => {
  const employee = await prisma.employee.findUnique({ where: { userId } });
  const slot     = await prisma.availabilitySlot.findUnique({ where: { id: slotId } });

  if (!slot || slot.employeeId !== employee.id)
    throw { status: 403, message: 'Not authorized to delete this slot' };

  await prisma.availabilitySlot.delete({ where: { id: slotId } });
  return { message: 'Slot deleted' };
};

// ── My Projects ──────────────────────────────────────────────
exports.getMyProjects = async (userId) => {
  const employee = await prisma.employee.findUnique({ where: { userId } });
  if (!employee) throw { status: 404, message: 'Employee not found' };

  return prisma.projectAssignment.findMany({
    where:   { employeeId: employee.id },
    include: { project: { include: { client: { select: { companyName: true, contactName: true } } } } },
  });
};

// ── Login Logs ───────────────────────────────────────────────
exports.getMyLogs = async (userId) => {
  return prisma.loginLog.findMany({
    where:   { userId },
    orderBy: { loginTime: 'desc' },
    take:    50,
  });
};