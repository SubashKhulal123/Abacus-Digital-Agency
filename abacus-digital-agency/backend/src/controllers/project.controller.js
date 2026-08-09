const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const ApiFeatures = require('../utils/ApiFeatures');
const Project = require('../models/Project.model');

const POPULATE = [
  { path: 'category', select: 'name slug' },
  { path: 'technologies', select: 'name slug icon color' },
  { path: 'client', select: 'name logo website industry' },
  { path: 'developers', select: 'name slug designation avatar' },
];

/**
 * @route GET /api/v1/projects
 * @desc  List published projects — supports ?category=, ?technology=,
 *        ?featured=true, ?search=, ?page=, ?limit=
 * @access Public
 */
const listProjects = asyncHandler(async (req, res) => {
  const filter = { status: 'published' };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.technology) filter.technologies = req.query.technology;
  if (req.query.featured === 'true') filter.isFeatured = true;

  let query = Project.find(filter);
  POPULATE.forEach((p) => {
    query = query.populate(p);
  });

  const features = new ApiFeatures(query, req.query)
    .search(['title', 'shortDescription'])
    .sort('order -createdAt')
    .limitFields();

  await features.paginate(9);
  const projects = await features.query;

  return new ApiResponse(200, projects, 'Projects fetched', features.meta).send(res);
});

/**
 * @route GET /api/v1/projects/:slug
 * @desc  Single project — increments the view counter
 * @access Public
 */
const getProjectBySlug = asyncHandler(async (req, res) => {
  let query = Project.findOneAndUpdate(
    { slug: req.params.slug, status: 'published' },
    { $inc: { views: 1 } },
    { new: true }
  );
  POPULATE.forEach((p) => {
    query = query.populate(p);
  });
  const project = await query;

  if (!project) throw ApiError.notFound('Project not found');

  return new ApiResponse(200, project, 'Project fetched').send(res);
});

module.exports = { listProjects, getProjectBySlug };
