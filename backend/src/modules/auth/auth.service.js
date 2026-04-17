const { prisma } = require("../../config/db");
const { comparePassword } = require("../../utils/bcrypt");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../../utils/jwt");


// ======================================================
// 🔐 LOGIN (Employee + HR + Admin)
// ======================================================
exports.loginUser = async ({ email, password, ip, userAgent }) => {

  // ✅ Normalize email (VERY IMPORTANT)
  const normalizedEmail = email.trim().toLowerCase();

  // ✅ Use findFirst instead of findUnique
  const user = await prisma.users.findFirst({
    where: {
      email: normalizedEmail,
    },
  });

  console.log("LOGIN EMAIL:", normalizedEmail);
  console.log("USER FOUND:", user);

  // ❌ If user not found or inactive
  if (!user || !user.isActive) {
    throw { status: 401, message: "Invalid credentials or inactive account" };
  }

  // 🔐 Compare password
  const valid = await comparePassword(password, user.password);

  console.log("PASSWORD MATCH:", valid);

  if (!valid) {
    throw { status: 401, message: "Invalid credentials" };
  }

  // 📝 Create login log
  const log = await prisma.loginLog.create({
    data: {
      userId: user.id,
      ipAddress: ip,
      userAgent,
    },
  });

  const payload = {
    id: user.id,
    role: user.role,
    logId: log.id,
  };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken({ id: user.id }),
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    logId: log.id,
  };
};


// ======================================================
// 🏢 CLIENT LOGIN
// ======================================================
exports.loginClient = async ({ email, password }) => {

  const normalizedEmail = email.trim().toLowerCase();

  const client = await prisma.users.findFirst({
    where: {
      email: normalizedEmail,
      role: "client",
    },
  });

  console.log("CLIENT LOGIN EMAIL:", normalizedEmail);
  console.log("CLIENT FOUND:", client);

  if (!client || !client.isActive) {
    throw { status: 401, message: "Invalid client credentials" };
  }

  const valid = await comparePassword(password, client.password);

  console.log("CLIENT PASSWORD MATCH:", valid);

  if (!valid) {
    throw { status: 401, message: "Invalid credentials" };
  }

  const payload = {
    id: client.id,
    role: client.role,
  };

  return {
    accessToken: signAccessToken(payload),
    user: {
      id: client.id,
      email: client.email,
      role: client.role,
    },
  };
};


// ======================================================
// 🚪 LOGOUT
// ======================================================
exports.logout = async ({ userId, logId }) => {

  const log = await prisma.loginLog.findFirst({
    where: {
      userId,
      id: logId,
      logoutTime: null,
    },
  });

  if (!log) {
    throw { status: 404, message: "Active session not found" };
  }

  const logoutTime = new Date();
  const sessionDuration = Math.floor(
    (logoutTime - log.loginTime) / 1000
  );

  await prisma.loginLog.update({
    where: { id: log.id },
    data: {
      logoutTime,
      sessionDuration,
    },
  });

  return {
    sessionDuration,
    message: "Logged out successfully",
  };
};


// ======================================================
// 🔄 REFRESH TOKEN
// ======================================================
exports.refreshToken = async (token) => {
  try {
    const payload = verifyRefreshToken(token);

    const user = await prisma.users.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      throw { status: 401, message: "User not found" };
    }

    return {
      accessToken: signAccessToken({
        id: user.id,
        role: user.role,
      }),
    };

  } catch {
    throw { status: 403, message: "Invalid or expired refresh token" };
  }
};