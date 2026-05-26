const jwt = require('jsonwebtoken');

exports.signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '1d',
  });

exports.signRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
  });

exports.verifyAccessToken  = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET);

exports.verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

 
//these fuctions are provided by the jsonwebtoken library, we use them to create and verify JWTs for secure communication between client and server.

//payload is the data we want to include in the token, such as user ID or email. The secret is a string that only the server knows, used to sign the token and verify its authenticity. The expiresIn option sets how long the token is valid for, after which it will expire and require a new one to be issued.
//payload in our case will be the user information that we want to include in the token, such as user ID or email. Which is added to token in file src/modules/AUTH/services/auth.service.js when user logs in or registers.

// access token is a short-lived token that is used to authenticate requests to protected routes or resources. It typically contains user information and permissions, and is included in the Authorization header of HTTP requests. A refresh token, on the other hand, is a long-lived token that is used to obtain a new access token when the current one expires. It is usually stored securely on the client side in an HttpOnly cookie, and is sent to the server when the access token needs to be refreshed. The server verifies the refresh token and issues a new access token if it is valid. This allows for seamless user experience without requiring the user to log in again when the access token expires.

// which of these are stored in cookies and which are stored in local storage? Access tokens are typically stored in memory or local storage on the client side, while refresh tokens are usually stored in HttpOnly cookies for enhanced security. Storing refresh tokens in HttpOnly cookies helps prevent cross-site scripting (XSS) attacks, as they cannot be accessed by JavaScript running in the browser. Access tokens, being short-lived, can be stored in memory or local storage without posing a significant security risk, as they will expire quickly and can be easily replaced with a new token obtained using the refresh token.