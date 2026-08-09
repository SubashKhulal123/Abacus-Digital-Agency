const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/ApiFeatures');
const Blog = require('../models/Blog.model');

const POPULATE = [
  { path: 'author', select: 'name avatar' },
  { path: 'category', select: 'name slug' },
];

/**
 * @route GET /api/v1/blogs
 * @desc  List published posts — ?category=, ?tag=, ?featured=true, ?search=
 * @access Public
 */
const listBlogs = asyncHandler(async (req, res) => {
  const filter = { status: 'published' };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.tag) filter.tags = req.query.tag;
  if (req.query.featured === 'true') filter.isFeatured = true;

  let query = Blog.find(filter);
  POPULATE.forEach((p) => {
    query = query.populate(p);
  });

  const features = new ApiFeatures(query, req.query)
    .search(['title', 'excerpt', 'tags'])
    .sort('-publishedAt')
    .limitFields();

  await features.paginate(9);
  const blogs = await features.query;

  return new ApiResponse(200, blogs, 'Blog posts fetched', features.meta).send(res);
});

/**
 * @route GET /api/v1/blogs/:slug
 * @desc  Single post — increments the view counter
 * @access Public
 */
const getBlogBySlug = asyncHandler(async (req, res) => {
  let query = Blog.findOneAndUpdate(
    { slug: req.params.slug, status: 'published' },
    { $inc: { views: 1 } },
    { new: true }
  );
  POPULATE.forEach((p) => {
    query = query.populate(p);
  });
  const blog = await query;

  if (!blog) throw ApiError.notFound('Blog post not found');

  return new ApiResponse(200, blog, 'Blog post fetched').send(res);
});

/**
 * @route POST /api/v1/blogs/:id/like
 * @access Public
 */
const likeBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  ).select('likes');

  if (!blog) throw ApiError.notFound('Blog post not found');

  return new ApiResponse(200, { likes: blog.likes }, 'Post liked').send(res);
});

module.exports = { listBlogs, getBlogBySlug, likeBlog };
