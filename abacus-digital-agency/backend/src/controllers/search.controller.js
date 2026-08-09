const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const Project = require('../models/Project.model');
const Blog = require('../models/Blog.model');
const Service = require('../models/Service.model');
const Developer = require('../models/Developer.model');

/**
 * @route GET /api/v1/search?q=keyword
 * @desc  Lightweight global search across the site's main public
 *        resources. Kept intentionally simple (regex match on a couple
 *        of fields per resource, capped at 5 results each) rather than a
 *        full-text/fuzzy search engine — sufficient for a marketing site
 *        of this size, cheap to run, and easy to reason about.
 * @access Public
 */
const globalSearch = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').trim();

  if (q.length < 2) {
    return new ApiResponse(200, { projects: [], blogs: [], services: [], developers: [] }, 'Query too short').send(res);
  }

  const regex = new RegExp(q, 'i');

  const [projects, blogs, services, developers] = await Promise.all([
    Project.find({ status: 'published', $or: [{ title: regex }, { shortDescription: regex }] })
      .select('title slug thumbnail category')
      .populate('category', 'name')
      .limit(5),
    Blog.find({ status: 'published', $or: [{ title: regex }, { excerpt: regex }, { tags: regex }] })
      .select('title slug coverImage category')
      .populate('category', 'name')
      .limit(5),
    Service.find({ isActive: true, $or: [{ title: regex }, { shortDescription: regex }] })
      .select('title slug icon')
      .limit(5),
    Developer.find({ isActive: true, $or: [{ name: regex }, { designation: regex }] })
      .select('name slug designation avatar')
      .limit(5),
  ]);

  return new ApiResponse(200, { projects, blogs, services, developers }, 'Search results fetched').send(res);
});

module.exports = { globalSearch };
