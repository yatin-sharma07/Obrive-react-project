const { prisma }          = require('../../config/db');
const { comparePassword } = require('../../utils/bcrypt');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../../utils/jwt');

// Employee / HR / Admin login
exports.loginUser = async ({ email, password, ip, userAgent }) => {
  const user = await prisma.users.findUnique({ where: { email } });
  console.log("LOGIN INPUT:", email, password);
console.log("USER FROM DB:", user);
  if (!user || !user.isActive)
    throw { status: 401, message: 'Invalid credentials or inactive account' };

  const valid = await comparePassword(password, user.password);
  if (!valid) throw { status: 401, message: 'Invalid credentials' };

  const log = await prisma.loginLog.create({
    data: { userId: user.id, ipAddress: ip, userAgent },
  });

  const payload      = { id: user.id, role: user.role, logId: log.id };
  const accessToken  = signAccessToken(payload);
  const refreshToken = signRefreshToken({ id: user.id });

  return {
    accessToken,
    refreshToken,
    logId: log.id,
    user:  { id: user.id, email: user.email, role: user.role },
  };
};

// Client login
exports.loginClient = async ({ clientId }) => {
  const client = await prisma.users.findUnique({
    where: { userid: clientId }, 
  });

  if (!client || client.role !== "client") {
    throw { status: 401, message: "Invalid client credentials" };
  }

  const payload = {
    id: client.id,
    role: client.role,
    clientId: client.userid,
  };

  const accessToken = signAccessToken(payload);

  return {
    accessToken,
    client: {
      id: client.id,
      clientId: client.userid,
      name: client.name,
    },
  };
};

// Logout
exports.logout = async ({ userId, logId }) => {
  const log = await prisma.loginLog.findFirst({
    where: { userId, id: logId, logoutTime: null },
  });
  if (!log) throw { status: 404, message: 'Active session not found' };

  const logoutTime      = new Date();
  const sessionDuration = Math.floor((logoutTime - log.loginTime) / 1000);

  await prisma.loginLog.update({
    where: { id: log.id },
    data:  { logoutTime, sessionDuration },
  });

  return { sessionDuration, message: 'Logged out successfully' };
};

// Refresh token
exports.refreshToken = async (token) => {
  try {
    const payload = verifyRefreshToken(token);
    const user    = await prisma.users.findUnique({ where: { id: payload.id } });
    if (!user) throw { status: 401, message: 'User not found' };

    const newAccess = signAccessToken({ id: user.id, role: user.role });
    return { accessToken: newAccess };
  } catch {
    throw { status: 403, message: 'Invalid or expired refresh token' };
  }
};