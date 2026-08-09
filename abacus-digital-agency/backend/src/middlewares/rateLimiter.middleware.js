const rateLimit = require('express-rate-limit');
const env = require('../config/env');

/**
 * General-purpose limiter applied globally to the whole API.
 */
const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many requests from this IP. Please try again later.',
  },
});

/**
 * Stricter limiter for sensitive auth endpoints (login) to slow down
 * brute-force / credential-stuffing attempts.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many login attempts. Please try again in 15 minutes.',
  },
});

/**
 * Limiter for public write endpoints (contact form, newsletter, job
 * applications) to prevent spam submissions.
 */
const publicWriteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many submissions from this IP. Please try again later.',
  },
});

module.exports = { globalLimiter, authLimiter, publicWriteLimiter };
