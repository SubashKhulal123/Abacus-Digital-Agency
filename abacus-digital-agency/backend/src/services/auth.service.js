const Admin = require('../models/Admin.model');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Authenticates an admin by email + password.
 * Handles brute-force protection via attempt counting + temporary lock.
 */
const authenticateAdmin = async (email, password, ipAddress) => {
  const admin = await Admin.findOne({ email }).select('+password +loginAttempts +lockUntil');

  if (!admin) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (admin.isLocked) {
    throw ApiError.forbidden(
      'This account is temporarily locked due to multiple failed login attempts. Please try again later.'
    );
  }

  if (!admin.isActive) {
    throw ApiError.forbidden('This admin account has been deactivated');
  }

  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    admin.loginAttempts = (admin.loginAttempts || 0) + 1;

    if (admin.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      admin.lockUntil = Date.now() + LOCK_TIME_MS;
      logger.warn(`Admin account locked after ${MAX_LOGIN_ATTEMPTS} failed attempts: ${email}`);
    }

    await admin.save();
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Successful login — reset attempt counters
  admin.loginAttempts = 0;
  admin.lockUntil = undefined;
  admin.lastLoginAt = new Date();
  admin.lastLoginIp = ipAddress;
  await admin.save();

  return admin;
};

module.exports = { authenticateAdmin };
