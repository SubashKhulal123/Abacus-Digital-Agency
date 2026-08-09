const ApiError = require('../utils/ApiError');
const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * Normalizes known error types (Mongoose validation, cast, duplicate key,
 * JWT errors) into a consistent ApiError before formatting the response.
 */
const normalizeError = (err) => {
  let error = err;

  // Mongoose invalid ObjectId
  if (err.name === 'CastError') {
    error = ApiError.badRequest(`Invalid value for field "${err.path}": ${err.value}`);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = ApiError.conflict(`A record with this ${field} already exists`);
  }

  // Mongoose schema validation
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = ApiError.badRequest('Validation failed', messages);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid authentication token');
  }
  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Authentication token has expired');
  }

  // Multer file size / upload errors
  if (err.name === 'MulterError') {
    error = ApiError.badRequest(`File upload error: ${err.message}`);
  }

  if (!(error instanceof ApiError)) {
    error = ApiError.internal(env.IS_DEV ? err.message : 'Internal Server Error');
  }

  return error;
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const error = normalizeError(err);

  if (error.statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} — ${error.message}\n${err.stack}`);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} — ${error.message}`);
  }

  res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    ...(env.IS_DEV ? { stack: err.stack } : {}),
  });
};

module.exports = errorHandler;
