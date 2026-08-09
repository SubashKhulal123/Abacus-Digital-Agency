const slugify = require('slugify');

/**
 * If req.body.slug is missing/empty, derives one from the given source
 * field (usually "title" or "name"). Applied on create routes so admins
 * don't have to manually type slugs, but can still override them.
 */
const autoSlug = (sourceField = 'title') => (req, res, next) => {
  if (!req.body.slug && req.body[sourceField]) {
    req.body.slug = slugify(req.body[sourceField], { lower: true, strict: true });
  }
  next();
};

module.exports = autoSlug;
