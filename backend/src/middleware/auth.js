const { verifyAccessToken } = require("../utils/jwt");
const { errorResponse } = require("../utils/apiResponse");
const { prisma } = require("../../prisma");

module.exports = async (req, res, next) => {
  try {
    let token;

    // 🔥 Check cookie first
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
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


//this middleware is used to protect routes that require authentication. It checks for the presence of a JWT access token in the cookies or Authorization header, verifies it, and attaches the decoded user information to the request object if valid. If the token is missing, invalid, or expired, it returns an appropriate error response. This allows us to secure our API endpoints and ensure that only authenticated users can access certain resources.
//it solves the problem of securing API routes by ensuring that only requests with valid JWT access tokens can access protected endpoints. It also handles token expiration and account status checks to prevent unauthorized access. By using this middleware, we can easily protect any route by simply adding it to the route definition, ensuring a consistent authentication mechanism across our application.
//we don't need to generate the tokens in this middleware because the tokens are generated at the backend when the user logs in or registers

//Is RAAC used here ? No, this middleware does not implement Role-Based Access Control (RBAC) directly. It only verifies the presence and validity of the JWT access token and checks if the user's account is active. However, you could extend this middleware to include RBAC by checking the user's role (which is included in the decoded token) against the required permissions for the route being accessed. This would allow you to restrict access to certain routes based on user roles, such as admin, moderator, or regular user. however it does check if the user's account is active or not, which is a basic form of access control to prevent blocked or inactive users from accessing protected resources.
//however it is used in apis which defines role-based access control, for example in file src/modules/AUTH/routes/auth.routes.js, the route for blocking a user is protected by this middleware and also checks if the user has the admin role before allowing access to the route. So while this middleware itself does not implement RBAC, it can be used in conjunction with RBAC checks in the route handlers to enforce role-based access control in the application.
