const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Signs a JWT access token embedding the admin's id and role.
 * @param {{ id: string, role: string }} payload
 * @returns {string} signed JWT
 */
const generateToken = (payload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRE });

/**
 * Verifies a JWT and returns the decoded payload, or throws.
 * @param {string} token
 */
const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET);

/**
 * Attaches the JWT as an httpOnly cookie on the response and also
 * returns it in the JSON body (useful for non-browser/API clients).
 */
const sendTokenResponse = (admin, statusCode, res, message = 'Success') => {
  const token = generateToken({ id: admin._id, role: admin.role });

  const cookieExpireDays = env.JWT_COOKIE_EXPIRE;
  const options = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: env.IS_PROD,
    sameSite: env.IS_PROD ? 'none' : 'lax',
    signed: true,
  };

  const ApiResponse = require('./ApiResponse');

  res.cookie('token', token, options);

  return new ApiResponse(
    statusCode,
    {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatar,
      },
    },
    message
  ).send(res);
};

module.exports = { generateToken, verifyToken, sendTokenResponse };
