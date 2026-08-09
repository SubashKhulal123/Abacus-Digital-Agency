const ApiError = require('../utils/ApiError');

/**
 * Restricts a route to specific admin roles. Must be used AFTER `protect`
 * so `req.admin` is already populated.
 *
 * Usage:
 *   router.delete('/:id', protect, authorize('super-admin'), controller.remove);
 */
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.admin) {
    throw ApiError.unauthorized('Not authorized — please log in first');
  }

  if (!allowedRoles.includes(req.admin.role)) {
    throw ApiError.forbidden(
      `Access denied — this action requires one of the following roles: ${allowedRoles.join(', ')}`
    );
  }

  next();
};

module.exports = authorize;
