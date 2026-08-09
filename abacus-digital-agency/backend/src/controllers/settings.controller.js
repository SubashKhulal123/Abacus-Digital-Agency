const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const SiteSettings = require('../models/SiteSettings.model');

/**
 * @route GET /api/v1/settings
 * @desc  Returns the singleton site settings document (creates a default
 *        one on first request if none exists yet, so the public site
 *        never 404s on a fresh database).
 * @access Public
 */
const getSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  return new ApiResponse(200, settings, 'Site settings fetched').send(res);
});

module.exports = { getSettings };
