const { prisma } = require('../../config/db');

exports.getAllEmployees = async ({ search = '', page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const where = search
    ? { OR: [{ fullName: { contains: search, mode: 'insensitive' } }] }
    : {};

  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      include: { user: { select: { email: true, isActive: true } } },
      skip, take: limit,
    }),
    prisma.employee.count({ where }),
  ]);

  return { employees, total, page, limit };
};

exports.getEmployee = async (id) => {
  const e = await prisma.employee.findUnique({
    where:   { id },
    include: {
      user:              { select: { email: true, isActive: true } },
      projectAssignments: { include: { project: true } },
      availabilitySlots:  { orderBy: { date: 'asc' } },
    },
  });
  if (!e) throw { status: 404, message: 'Employee not found' };
  return e;
};

exports.getEmployeeLogs = async (employeeId) => {
  const emp = await prisma.employee.findUnique({ where: { id: employeeId } });
  if (!emp) throw { status: 404, message: 'Employee not found' };

  const logs = await prisma.loginLog.findMany({
    where:   { userId: emp.userId },
    orderBy: { loginTime: 'desc' },
  });

  // Compute total session time
  const totalSeconds = logs.reduce((sum, l) => sum + (l.sessionDuration || 0), 0);
  return { logs, totalSessionSeconds: totalSeconds };
};

exports.getEmployeeAvailability = async (employeeId, date) => {
  const where = { employeeId };
  if (date) where.date = new Date(date);
  return prisma.availabilitySlot.findMany({ where, orderBy: { date: 'asc' } });
};

exports.getAllProjects = async (status) => {
  const where = status ? { status } : {};
  return prisma.project.findMany({
    where,
    include: {
      client:      { select: { companyName: true, contactName: true } },
      assignments: { include: { employee: { select: { fullName: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

exports.updateProjectStatus = async (projectId, status) => {
  return prisma.project.update({
    where: { id: projectId },
    data:  { status },
  });
};

exports.assignEmployee = async (hrUserId, { employeeId, projectId, role }) => {
  // Verify both exist
  const [emp, proj] = await Promise.all([
    prisma.employee.findUnique({ where: { id: employeeId } }),
    prisma.project.findUnique({ where: { id: projectId } }),
  ]);
  if (!emp)  throw { status: 404, message: 'Employee not found' };
  if (!proj) throw { status: 404, message: 'Project not found' };

  return prisma.projectAssignment.create({
    data: { employeeId, projectId, assignedBy: hrUserId, role },
  });
};

exports.unassignEmployee = async (assignmentId) => {
  return prisma.projectAssignment.delete({ where: { id: assignmentId } });
};