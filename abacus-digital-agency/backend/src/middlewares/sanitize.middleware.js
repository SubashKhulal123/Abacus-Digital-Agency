/**
 * xss-clean is unmaintained and no longer recommended for production use.
 * This is a small, dependency-free replacement that strips raw HTML tags
 * and script-injection vectors from string input recursively across
 * req.body, req.query, and req.params. It is defense-in-depth — the real
 * protection against XSS is that React escapes output by default and all
 * write endpoints are validated with Zod schemas.
 */
const HTML_TAG_REGEX = /<[^>]*>?/gm;

const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return value.replace(HTML_TAG_REGEX, '').trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object') {
    return sanitizeObject(value);
  }
  return value;
};

const sanitizeObject = (obj) => {
  const sanitized = {};
  for (const key of Object.keys(obj)) {
    sanitized[key] = sanitizeValue(obj[key]);
  }
  return sanitized;
};

/**
 * Applied GLOBALLY in app.js. Only touches req.query and req.params —
 * these should never legitimately contain HTML, so stripping tags here
 * is always safe. req.body is intentionally left untouched here because
 * CMS resources (blog content, service descriptions) store real HTML/rich
 * text that a blanket strip would corrupt.
 */
const sanitizeQueryAndParams = (req, res, next) => {
  if (req.params && typeof req.params === 'object') req.params = sanitizeObject(req.params);
  // req.query is a getter-only property on some Express/Node versions;
  // mutate its keys in place instead of reassigning the object itself.
  if (req.query && typeof req.query === 'object') {
    const cleaned = sanitizeObject(req.query);
    Object.keys(req.query).forEach((key) => delete req.query[key]);
    Object.assign(req.query, cleaned);
  }
  next();
};

/**
 * Opt-in, per-route middleware for endpoints where EVERY body field is
 * plain text (e.g. contact form, newsletter signup, career application
 * text fields). Do NOT use this on routes that accept rich-text/HTML
 * content (blogs, services, project descriptions) — sanitize those at
 * render time on the frontend (e.g. DOMPurify) instead.
 */
const sanitizePlainTextBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') req.body = sanitizeObject(req.body);
  next();
};

module.exports = { sanitizeQueryAndParams, sanitizePlainTextBody };
