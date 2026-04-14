const { prisma }       = require('../../config/db');
const { hashPassword } = require('../../utils/bcrypt');

exports.getAllUsers = async () => {
  const [users, clients] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true, email: true, role: true,
        isActive: true, createdAt: true,
        employee: { select: { fullName: true, department: true, designation: true } },
        hr:       { select: { fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.client.findMany({
      select: {
        id: true, clientId: true, companyName: true,
        contactName: true, email: true, isActive: true, createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);
  return { users, clients };
};

exports.createEmployee = async (data) => {
  const hash = await hashPassword(data.password);
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email: data.email, password: hash, role: 'EMPLOYEE' },
    });
    const employee = await tx.employee.create({
      data: {
        userId:      user.id,
        fullName:    data.fullName,
        phone:       data.phone,
        department:  data.department,
        designation: data.designation,
        dateJoined:  data.dateJoined ? new Date(data.dateJoined) : undefined,
      },
    });
    return {
      user:     { id: user.id, email: user.email, role: user.role },
      employee: { id: employee.id, fullName: employee.fullName },
    };
  });
};

exports.createHr = async (data) => {
  const hash = await hashPassword(data.password);
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email: data.email, password: hash, role: 'HR' },
    });
    const hr = await tx.hr.create({
      data: { userId: user.id, fullName: data.fullName, phone: data.phone },
    });
    return {
      user: { id: user.id, email: user.email, role: user.role },
      hr:   { id: hr.id, fullName: hr.fullName },
    };
  });
};

exports.createClient = async (data) => {
  const hash  = await hashPassword(data.password);
  const count = await prisma.client.count();
  const clientId = `CLT-${String(count + 1).padStart(4, '0')}`;

  const client = await prisma.client.create({
    data: {
      clientId,
      email:       data.email,
      password:    hash,
      companyName: data.companyName,
      contactName: data.contactName,
      phone:       data.phone,
      industry:    data.industry,
    },
    select: {
      id: true, clientId: true,
      companyName: true, email: true, contactName: true,
    },
  });
  return client;
};

exports.toggleUserActive = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw { status: 404, message: 'User not found' };

  return prisma.user.update({
    where: { id: userId },
    data:  { isActive: !user.isActive },
    select: { id: true, email: true, role: true, isActive: true },
  });
};

exports.deleteUser = async (userId) => {
  await prisma.user.delete({ where: { id: userId } });
  return { message: 'User deleted successfully' };
};

exports.getAllLogs = async ({ page = 1, limit = 50 }) => {
  const skip = (page - 1) * limit;
  return prisma.loginLog.findMany({
    include: { user: { select: { email: true, role: true } } },
    orderBy: { loginTime: 'desc' },
    skip,
    take: Number(limit),
  });
};

exports.getDashboardStats = async () => {
  const [
    totalEmployees,
    totalClients,
    totalProjects,
    activeProjects,
    recentLogs,
  ] = await Promise.all([
    prisma.employee.count(),
    prisma.client.count(),
    prisma.project.count(),
    prisma.project.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.loginLog.findMany({
      take:    10,
      orderBy: { loginTime: 'desc' },
      include: { user: { select: { email: true, role: true } } },
    }),
  ]);

  return { totalEmployees, totalClients, totalProjects, activeProjects, recentLogs };
};