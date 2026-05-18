// backend/src/modules/auth/auth.service.js
const { prisma } = require("../../../prisma");
const bcrypt = require("bcrypt");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../../utils/jwt");

// Employee / HR / Admin / Supervisor login
exports.loginUser = async ({ email, password, ip, userAgent }) => { //ip and userAgent are optional parameters for logging purposes
  // Use raw query to find user by email
  const result = await prisma.$queryRaw`
    SELECT id, userid, email, name, role, password, status, is_active
    FROM users 
    WHERE email = ${email} AND (role = 'employee' OR role = 'hr' OR role = 'admin' OR role = 'supervisor')
    LIMIT 1
  `;

  const user = result[0];

  if (!user) {
    throw { status: 401, message: "Invalid credentials or inactive account" };
  }

  if (user.is_active === false || user.status === "inactive") {
    throw {
      status: 403,
      message: "Account blocked. Contact admin or supervisor",
    };
  }

  // Compare password
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw { status: 401, message: "Invalid credentials" };
  }

  // Log login
  let log = null;
  try {
    const logResult = await prisma.$queryRaw`
      INSERT INTO login_logs (user_id, ip_address, user_agent, success, created_at)
      VALUES (${user.id}, ${ip}, ${userAgent}, true, NOW())
      RETURNING id
    `;
    log = logResult[0];
  } catch (_err) {
    console.log("Login log not recorded - table might not exist");
  }

  const payload = { id: user.id, role: user.role, logId: log?.id };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken({ id: user.id });

  return {
    accessToken,
    refreshToken,
    logId: log?.id,
    user: {
      id: user.id,
      userid: user.userid,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
};


exports.loginClient = async ({ clientId, password }) => {
  const result = await prisma.$queryRaw`
    SELECT id, userid, email, name, role, password, status 
    FROM users 
    WHERE (email = ${clientId} OR userid = ${clientId}) AND role = 'client'
    LIMIT 1
  `;

  const client = result[0];
  

  if (!client || client.status === 'inactive') {
    throw { status: 401, message: 'Invalid client credentials' };
  }
  
  const isValid = await bcrypt.compare(password, client.password);
  
  if (!isValid) {
    throw { status: 401, message: 'Invalid client credentials' };
  }
  

  const payload = { id: client.id, role: 'client', clientId: client.userid };
  const accessToken = signAccessToken(payload);

  return {
    accessToken,
    client: {
      id: client.id,
      clientId: client.userid,
      name: client.name,
      email: client.email,
    },
  };
};

// Logout
exports.logout = async ({ userId, logId }) => {
  try {
    const log = await prisma.login_logs.findFirst({
      where: {
        userId,
        id: logId,
        logoutTime: null,
      },
    });

    if (!log) throw { status: 404, message: "Active session not found" };

    const logoutTime = new Date();
    const sessionDuration = Math.floor((logoutTime - log.loginTime) / 1000);

    await prisma.login_logs.update({
      where: { id: logId },
      data: {
        logoutTime,
        sessionDuration,
      },
    });

    return { sessionDuration, message: "Logged out successfully" };
  } catch (_err) {
    throw { status: 404, message: "Active session not found" };
  }
};

// Get current user with full details (used by /auth/me endpoint)
exports.getCurrentUserDetails = async (userId) => {
  try {
    const user = await prisma.$queryRaw`
      SELECT id, userid, email, name, role, status, is_active
      FROM users 
      WHERE id = ${userId}
      LIMIT 1
    `;

    if (!user[0]) {
      throw { status: 401, message: "User not found" };
    }

    return {
      id: user[0].id,
      userid: user[0].userid,
      email: user[0].email,
      name: user[0].name,
      role: user[0].role,
      status: user[0].status,
      is_active: user[0].is_active,
    };
  } catch (_err) {
    throw { status: 401, message: "Failed to fetch user details" };
  }
};

// Refresh token
exports.refreshToken = async (token) => {
  try {
    const payload = verifyRefreshToken(token);
    const user = await prisma.$queryRaw`
      SELECT id, role, status, is_active FROM users WHERE id = ${payload.id} LIMIT 1
    `;

    if (!user[0]) throw { status: 401, message: "User not found" };
    if (user[0].is_active === false || user[0].status === "inactive") {
      throw { status: 403, message: "Account blocked" };
    }

    const newAccess = signAccessToken({ id: user[0].id, role: user[0].role });
    return { accessToken: newAccess };
  } catch {
    throw { status: 403, message: "Invalid or expired refresh token" };
  }
};

// Get all users for admin/HR (FIXED)
exports.getAllUsers = async () => {
  const result = await prisma.$queryRaw`
    SELECT 
      id,
      userid,
      email,
      name,
      role,
      status,
      job_title,
      department,
      date_of_birth,
      bio,
      phone_number,
      created_at
    FROM users
    ORDER BY created_at DESC
  `;

  return result;
};
