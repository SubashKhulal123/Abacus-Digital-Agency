const ApiError = require('../utils/ApiError');

/**
 * Catches any request that didn't match a defined route and forwards
 * a standardized 404 error to the global error handler.
 */
const notFound = (req, res, next) => {
  next(ApiError.notFound(`Route not found — ${req.method} ${req.originalUrl}`));
};

module.exports = notFound;
