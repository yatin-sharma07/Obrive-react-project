const { verifyAccessToken } = require("../utils/jwt");
const { errorResponse } = require("../utils/apiResponse");
const { prisma } = require("../../prisma");

module.exports = async (req, res, next) => {
  try {
    let token;

    // 🔥 Check cookie first
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
      console.log("COOKIES:", req.cookies);
    }
    // fallback to header
    else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return errorResponse(res, "No token provided", 401);
    }

    const decoded = verifyAccessToken(token);
    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, status: true, is_active: true },
    });

    if (!user || user.is_active === false || user.status === "inactive") {
      return errorResponse(res, "Account blocked", 403);
    }

    req.user = decoded;
    next();
  } catch (err) {
    const msg =
      err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    return errorResponse(res, msg, 401);
  }
};
