// backend/src/socket/middleware/auth.middleware.js
const { verifyAccessToken } = require("../../utils/jwt");
const { prisma } = require("../../../prisma");
const cookie = require("cookie");

exports.socketAuthMiddleware = async (socket, next) => {
  try {
    let token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];

    // If no token in auth or header, check cookies
    // if (!token && socket.handshake.headers.cookie) {
    //   const cookies = cookie.parse(socket.handshake.headers.cookie);
    //   token = cookies.accessToken;
    // }

    // if (!token) {
    //   return next(new Error("Authentication error: No token provided"));
    // }
// ✅ DEVELOPMENT MODE: Allow connection without token if userId is provided
if (!token) {
  const userId = socket.handshake.auth.userId;
  if (userId) {
    console.log(`⚠️  DEVELOPMENT MODE: Connecting user ${userId} without authentication`);
    socket.user = { id: userId, name: `User ${userId}` };
    return next();
  }
  // If no token AND no userId fallback, reject
  return next(new Error("Authentication error: No token or userId provided"));
}


    const decoded = verifyAccessToken(token);
    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, role: true, status: true, is_active: true },
    });

    if (!user || user.is_active === false || user.status === "inactive") {
      return next(new Error("Authentication error: Account blocked"));
    }

    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
};
