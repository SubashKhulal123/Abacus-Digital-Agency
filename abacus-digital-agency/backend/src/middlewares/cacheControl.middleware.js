/**
 * Applies a short, safe Cache-Control header to public GET endpoints —
 * `stale-while-revalidate` lets a CDN/browser serve a slightly-stale
 * response instantly while it refetches in the background, which is a
 * meaningful perceived-performance win for content that changes rarely
 * (services, technologies, FAQs) without ever showing wildly outdated data.
 *
 * @param {number} maxAgeSeconds
 */
const cacheControl = (maxAgeSeconds = 60) => (req, res, next) => {
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${maxAgeSeconds * 5}`);
  }
  next();
};

module.exports = cacheControl;
