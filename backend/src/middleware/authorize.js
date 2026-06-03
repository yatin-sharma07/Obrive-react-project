module.exports = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthenticated' });
  if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};

//1. This middleware function is used to restrict access to certain routes based on user roles. It checks if the authenticated user's role (which should be attached to the request object by a previous authentication middleware) is included in the list of allowed roles specified when the middleware is applied to a route. If the user's role is not allowed, it returns a 403 Forbidden response. If the user is not authenticated (i.e., req.user is not set), it returns a 401 Unauthenticated response. If the user's role is allowed, it calls the next middleware or route handler.
//This function works after the authentication middleware has verified the user's identity and attached their information (including their role) to the request object. By using this middleware, you can easily protect routes by specifying which roles are allowed to access them, ensuring that only users with the appropriate permissions can access certain resources or perform specific actions.