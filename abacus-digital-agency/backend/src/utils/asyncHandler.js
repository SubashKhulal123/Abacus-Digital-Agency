/**
 * Wraps an async controller/middleware function and forwards any thrown
 * error to Express's `next()`, so the global error handler catches it.
 * Removes the need for repetitive try/catch blocks in every controller.
 *
 * Usage:
 *   exports.getProjects = asyncHandler(async (req, res) => { ... });
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
