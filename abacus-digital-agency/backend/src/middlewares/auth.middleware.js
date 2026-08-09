const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../utils/generateToken');
const Admin = require('../models/Admin.model');
const { COOKIE_NAME } = require('../constants');

/**
 * Protects a route — requires a valid JWT via either:
 *   1. httpOnly cookie ("token"), or
 *   2. "Authorization: Bearer <token>" header (for non-browser API clients)
 *
 * On success, attaches the authenticated admin document to `req.admin`.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.signedCookies?.[COOKIE_NAME]) {
    token = req.signedCookies[COOKIE_NAME];
  } else if (req.cookies?.[COOKIE_NAME]) {
    token = req.cookies[COOKIE_NAME];
  }

  if (!token) {
    throw ApiError.unauthorized('Not authorized — no authentication token provided');
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    throw ApiError.unauthorized('Not authorized — token is invalid or expired');
  }

  const admin = await Admin.findById(decoded.id);

  if (!admin) {
    throw ApiError.unauthorized('Not authorized — admin account no longer exists');
  }

  if (!admin.isActive) {
    throw ApiError.forbidden('This admin account has been deactivated');
  }

  if (admin.isLocked) {
    throw ApiError.forbidden('This admin account is temporarily locked');
  }

  req.admin = admin;
  next();
});

module.exports = protect;
