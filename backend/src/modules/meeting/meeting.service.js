const { prisma } = require('../../config/db');

exports.getMeetings = async (userId, role) => {
  if (role === 'EMPLOYEE') {
    const emp = await prisma.employee.findUnique({ where: { userId } });
    return prisma.meeting.findMany({
      where:   { participants: { some: { employeeId: emp.id } } },
      include: { participants: { include: { employee: { select: { fullName: true } } } } },
    });
  }
  return prisma.meeting.findMany({
    include: { participants: { include: { employee: { select: { fullName: true } } } } },
    orderBy: { date: 'asc' },
  });
};

exports.scheduleMeeting = async (createdBy, data) => {
  // Check availability for all participants
  const conflicts = await prisma.availabilitySlot.findMany({
    where: {
      employeeId: { in: data.participantIds },
      date:       new Date(data.date),
      slotType:   'BUSY',
      startTime:  { lt: data.endTime },
      endTime:    { gt: data.startTime },
    },
    include: { employee: { select: { fullName: true } } },
  });

  if (conflicts.length > 0) {
    const names = conflicts.map(c => c.employee.fullName).join(', ');
    throw { status: 409, message: `Scheduling conflict for: ${names}` };
  }

  return prisma.meeting.create({
    data: {
      title:       data.title,
      description: data.description,
      projectId:   data.projectId,
      date:        new Date(data.date),
      startTime:   data.startTime,
      endTime:     data.endTime,
      createdBy,
      participants: {
        create: data.participantIds.map(empId => ({ employeeId: empId })),
      },
    },
    include: { participants: { include: { employee: { select: { fullName: true } } } } },
  });
};

exports.updateMeetingStatus = async (meetingId, status) => {
  return prisma.meeting.update({
    where: { id: meetingId },
    data:  { status },
  });
};

exports.cancelMeeting = async (meetingId) => {
  return prisma.meeting.delete({ where: { id: meetingId } });
};