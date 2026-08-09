const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const recordAuditLog = require('../../utils/auditLogger');
const SiteSettings = require('../../models/SiteSettings.model');
const { uploadToCloudinary } = require('../../utils/cloudinaryUpload');
const env = require('../../config/env');

/**
 * @route GET /api/v1/admin/settings
 * @desc  Full settings document for the admin panel (creates a default
 *        one if none exists yet).
 */
const getSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) settings = await SiteSettings.create({});
  return new ApiResponse(200, settings, 'Settings fetched').send(res);
});

/**
 * @route PATCH /api/v1/admin/settings
 * @desc  Updates any subset of the settings document. Accepts JSON body;
 *        logo/favicon files are uploaded separately via /settings/logo etc.
 * @access Super Admin only
 */
const updateSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });

  recordAuditLog({
    admin: req.admin,
    action: 'update',
    resource: 'Settings',
    description: 'Updated site settings',
    ipAddress: req.ip,
    metadata: { updatedKeys: Object.keys(req.body) },
  });

  return new ApiResponse(200, settings, 'Settings updated successfully').send(res);
});

/**
 * @route POST /api/v1/admin/settings/upload/:field
 * @desc  Uploads logo/logoDark/favicon and saves it onto the settings doc.
 */
const uploadBrandAsset = asyncHandler(async (req, res) => {
  const allowedFields = ['logo', 'logoDark', 'favicon'];
  const field = req.params.field;

  if (!allowedFields.includes(field)) {
    return new ApiResponse(400, null, `Field must be one of: ${allowedFields.join(', ')}`).send(res);
  }
  if (!req.file) {
    return new ApiResponse(400, null, 'Please select a file to upload').send(res);
  }

  const uploaded = await uploadToCloudinary(req.file.buffer, { folder: 'site-settings' });
  const settings = await SiteSettings.findOneAndUpdate(
    {},
    { [field]: { url: uploaded.url, publicId: uploaded.publicId } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  recordAuditLog({
    admin: req.admin,
    action: 'update',
    resource: 'Settings',
    description: `Uploaded new ${field}`,
    ipAddress: req.ip,
  });

  return new ApiResponse(200, settings, `${field} updated successfully`).send(res);
});

/**
 * @route GET /api/v1/admin/settings/env-config
 * @desc  Read-only, masked view of environment-based configuration
 *        (SMTP, Cloudinary). These are intentionally NOT stored/editable
 *        in the database — they're secrets and belong in environment
 *        variables. This endpoint exists so the admin UI can show
 *        "what's currently configured" without exposing secret values,
 *        and explain that changes require updating .env and restarting.
 */
const getEnvConfig = asyncHandler(async (req, res) => {
  const mask = (value) => {
    if (!value) return null;
    if (value.length <= 4) return '••••';
    return `${value.slice(0, 2)}${'•'.repeat(Math.max(value.length - 4, 4))}${value.slice(-2)}`;
  };

  const config = {
    smtp: {
      host: env.SMTP_HOST || null,
      port: env.SMTP_PORT || null,
      user: mask(env.SMTP_EMAIL),
      fromName: env.SMTP_FROM_NAME,
      configured: !!(env.SMTP_HOST && env.SMTP_EMAIL),
    },
    cloudinary: {
      cloudName: env.CLOUDINARY_CLOUD_NAME || null,
      apiKey: mask(env.CLOUDINARY_API_KEY),
      configured: !!(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY),
    },
    database: {
      configured: !!env.MONGO_URI,
    },
  };

  return new ApiResponse(200, config, 'Environment configuration fetched').send(res);
});

module.exports = { getSettings, updateSettings, uploadBrandAsset, getEnvConfig };
