const SiteSettings = require('../models/SiteSettings.model');
const ApiResponse = require('../utils/ApiResponse');

/**
 * When maintenance mode is enabled in Site Settings, this short-circuits
 * every PUBLIC request with a 503 + the configured message — but never
 * blocks /api/v1/auth or /api/v1/admin routes, so admins can always log
 * in and disable maintenance mode again. Fails open (lets the request
 * through) if the settings lookup itself errors, so a DB hiccup can't
 * accidentally take the whole public site offline.
 */
const maintenanceMode = async (req, res, next) => {
  try {
    const settings = await SiteSettings.findOne().select('maintenanceMode').lean();

    if (settings?.maintenanceMode?.isEnabled) {
      return new ApiResponse(
        503,
        { maintenanceMode: true },
        settings.maintenanceMode.message || 'We are currently performing scheduled maintenance.'
      ).send(res);
    }

    return next();
  } catch (error) {
    return next();
  }
};

module.exports = maintenanceMode;
