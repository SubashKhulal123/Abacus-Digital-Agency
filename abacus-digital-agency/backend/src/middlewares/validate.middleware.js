const ApiError = require('../utils/ApiError');

/**
 * Runs a Zod schema against the request and throws a formatted ApiError
 * on failure. Schemas are defined per-resource in /src/validators.
 *
 * Usage:
 *   router.post('/login', validate(loginSchema), authController.login);
 *
 * The schema should validate an object shaped like:
 *   { body: {...}, query: {...}, params: {...} }
 */
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.slice(1).join('.'), // strip leading "body"/"query"/"params"
      message: issue.message,
    }));
    throw ApiError.badRequest('Validation failed', errors);
  }

  // Overwrite with parsed & coerced values
  req.body = result.data.body ?? req.body;
  req.query = result.data.query ?? req.query;
  req.params = result.data.params ?? req.params;

  next();
};

module.exports = validate;
