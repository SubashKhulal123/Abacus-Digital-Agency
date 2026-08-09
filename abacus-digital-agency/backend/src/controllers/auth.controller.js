const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const crypto = require('crypto');
const { sendTokenResponse } = require('../utils/generateToken');
const { authenticateAdmin } = require('../services/auth.service');
const Admin = require('../models/Admin.model');
const { COOKIE_NAME } = require('../constants');
const env = require('../config/env');

/**
 * @route   POST /api/v1/auth/login
 * @desc    Admin login — issues an httpOnly JWT cookie + token in body
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const ipAddress = req.ip;

  const admin = await authenticateAdmin(email, password, ipAddress);

  sendTokenResponse(admin, 200, res, 'Login successful');
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Clears the auth cookie
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  res.cookie(COOKIE_NAME, 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
    secure: env.IS_PROD,
    sameSite: env.IS_PROD ? 'none' : 'lax',
    signed: true,
  });

  return new ApiResponse(200, null, 'Logged out successfully').send(res);
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Returns the currently authenticated admin
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  return new ApiResponse(200, req.admin.toSafeObject(), 'Current admin fetched').send(res);
});

/**
 * @route   PATCH /api/v1/auth/profile
 * @desc    Update the authenticated admin's name/email
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (email && email !== req.admin.email) {
    const existing = await Admin.findOne({ email });
    if (existing) throw ApiError.conflict('This email is already in use');
  }

  const admin = await Admin.findByIdAndUpdate(
    req.admin._id,
    { ...(name && { name }), ...(email && { email }) },
    { new: true, runValidators: true }
  );

  return new ApiResponse(200, admin.toSafeObject(), 'Profile updated successfully').send(res);
});

/**
 * @route   PATCH /api/v1/auth/change-password
 * @desc    Change the authenticated admin's password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.admin._id).select('+password');

  const isMatch = await admin.comparePassword(currentPassword);
  if (!isMatch) {
    throw ApiError.badRequest('Current password is incorrect');
  }

  admin.password = newPassword;
  await admin.save();

  return new ApiResponse(200, null, 'Password changed successfully. Please log in again.').send(res);
});

/**
 * @route   POST /api/v1/auth/2fa/enable
 * @desc    Generates a 2FA secret + one-time backup codes and marks the
 *          account as 2FA-enabled.
 *
 *          NOTE — scaffold, not a complete authenticator flow: this
 *          generates and stores a secret/backup codes and flips the
 *          isEnabled flag, but the login endpoint does not yet prompt for
 *          or verify a TOTP code. Wiring a real authenticator app (e.g.
 *          via the `otplib` package) means: (1) return the secret as a
 *          QR code here, (2) require a verification code before setting
 *          isEnabled, and (3) check `admin.twoFactor.isEnabled` in
 *          `auth.service.js`'s `authenticateAdmin` to prompt for a code
 *          before issuing a token. The schema and toggle below are ready
 *          for that wiring.
 * @access  Private
 */
const enableTwoFactor = asyncHandler(async (req, res) => {
  const secret = crypto.randomBytes(20).toString('hex');
  const backupCodes = Array.from({ length: 8 }, () => crypto.randomBytes(4).toString('hex'));

  await Admin.findByIdAndUpdate(req.admin._id, {
    'twoFactor.isEnabled': true,
    'twoFactor.secret': secret,
    'twoFactor.backupCodes': backupCodes,
  });

  return new ApiResponse(
    200,
    { secret, backupCodes },
    'Two-factor authentication enabled. Store these backup codes somewhere safe — they will not be shown again.'
  ).send(res);
});

/**
 * @route   POST /api/v1/auth/2fa/disable
 * @access  Private
 */
const disableTwoFactor = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const admin = await Admin.findById(req.admin._id).select('+password');

  const isMatch = await admin.comparePassword(password || '');
  if (!isMatch) throw ApiError.badRequest('Password is incorrect');

  admin.twoFactor = { isEnabled: false, secret: null, backupCodes: [] };
  await admin.save();

  return new ApiResponse(200, null, 'Two-factor authentication disabled').send(res);
});

module.exports = {
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  enableTwoFactor,
  disableTwoFactor,
};
