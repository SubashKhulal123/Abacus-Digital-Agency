const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const ApiFeatures = require('../../utils/ApiFeatures');
const recordAuditLog = require('../../utils/auditLogger');
const { uploadToCloudinary } = require('../../utils/cloudinaryUpload');
const Blog = require('../../models/Blog.model');

const POPULATE = [
  { path: 'author', select: 'name avatar' },
  { path: 'category', select: 'name slug' },
];

const parseArrayField = (value) => {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch (_) {
    return String(value).split(',').map((v) => v.trim()).filter(Boolean);
  }
};

const normalizeBody = (body) => {
  const normalized = { ...body };
  if (normalized.tags !== undefined) normalized.tags = parseArrayField(normalized.tags);
  if (normalized.seo !== undefined && typeof normalized.seo === 'string') {
    try {
      normalized.seo = JSON.parse(normalized.seo);
    } catch (_) {
      delete normalized.seo;
    }
  }
  if (normalized.status === 'published' && !normalized.publishedAt) {
    normalized.publishedAt = new Date();
  }
  return normalized;
};

const list = asyncHandler(async (req, res) => {
  let query = Blog.find({});
  POPULATE.forEach((p) => { query = query.populate(p); });

  const features = new ApiFeatures(query, req.query)
    .filter()
    .search(['title', 'excerpt', 'tags'])
    .sort('-createdAt')
    .limitFields();

  await features.paginate(20);
  const results = await features.query;

  return new ApiResponse(200, results, 'Blog posts fetched', features.meta).send(res);
});

const getOne = asyncHandler(async (req, res) => {
  let query = Blog.findById(req.params.id);
  POPULATE.forEach((p) => { query = query.populate(p); });
  const doc = await query;
  if (!doc) throw ApiError.notFound('Blog post not found');
  return new ApiResponse(200, doc, 'Blog post fetched').send(res);
});

const create = asyncHandler(async (req, res) => {
  const body = normalizeBody(req.body);
  body.author = body.author || req.admin._id;

  if (req.file) {
    const uploaded = await uploadToCloudinary(req.file.buffer, { folder: 'blogs' });
    body.coverImage = { url: uploaded.url, publicId: uploaded.publicId };
  }

  const doc = await Blog.create(body);

  recordAuditLog({
    admin: req.admin,
    action: 'create',
    resource: 'Blog',
    resourceId: doc._id,
    description: `Created blog post "${doc.title}" (${doc.status})`,
    ipAddress: req.ip,
  });

  return new ApiResponse(201, doc, 'Blog post created successfully').send(res);
});

const update = asyncHandler(async (req, res) => {
  const body = normalizeBody(req.body);

  if (req.file) {
    const uploaded = await uploadToCloudinary(req.file.buffer, { folder: 'blogs' });
    body.coverImage = { url: uploaded.url, publicId: uploaded.publicId };
  }

  const doc = await Blog.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
  if (!doc) throw ApiError.notFound('Blog post not found');

  recordAuditLog({
    admin: req.admin,
    action: 'update',
    resource: 'Blog',
    resourceId: doc._id,
    description: `Updated blog post "${doc.title}"`,
    ipAddress: req.ip,
  });

  return new ApiResponse(200, doc, 'Blog post updated successfully').send(res);
});

const remove = asyncHandler(async (req, res) => {
  const doc = await Blog.findByIdAndDelete(req.params.id);
  if (!doc) throw ApiError.notFound('Blog post not found');

  recordAuditLog({
    admin: req.admin,
    action: 'delete',
    resource: 'Blog',
    resourceId: doc._id,
    description: `Deleted blog post "${doc.title}"`,
    ipAddress: req.ip,
  });

  return new ApiResponse(200, null, 'Blog post deleted successfully').send(res);
});

const bulkRemove = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) throw ApiError.badRequest('Please provide ids to delete');
  const result = await Blog.deleteMany({ _id: { $in: ids } });

  recordAuditLog({
    admin: req.admin,
    action: 'bulk_delete',
    resource: 'Blog',
    description: `Bulk deleted ${result.deletedCount} blog post(s)`,
    ipAddress: req.ip,
    metadata: { ids },
  });

  return new ApiResponse(200, { deletedCount: result.deletedCount }, 'Blog posts deleted successfully').send(res);
});

module.exports = { list, getOne, create, update, remove, bulkRemove };
