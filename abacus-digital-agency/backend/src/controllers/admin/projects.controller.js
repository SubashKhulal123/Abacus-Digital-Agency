const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const ApiFeatures = require('../../utils/ApiFeatures');
const recordAuditLog = require('../../utils/auditLogger');
const { uploadToCloudinary } = require('../../utils/cloudinaryUpload');
const Project = require('../../models/Project.model');

const POPULATE = [
  { path: 'category', select: 'name slug' },
  { path: 'technologies', select: 'name slug' },
  { path: 'client', select: 'name logo' },
  { path: 'developers', select: 'name avatar' },
];

const list = asyncHandler(async (req, res) => {
  let query = Project.find({});
  POPULATE.forEach((p) => { query = query.populate(p); });

  const features = new ApiFeatures(query, req.query)
    .filter()
    .search(['title', 'shortDescription'])
    .sort('-createdAt')
    .limitFields();

  await features.paginate(20);
  const results = await features.query;

  return new ApiResponse(200, results, 'Projects fetched', features.meta).send(res);
});

const getOne = asyncHandler(async (req, res) => {
  let query = Project.findById(req.params.id);
  POPULATE.forEach((p) => { query = query.populate(p); });
  const doc = await query;
  if (!doc) throw ApiError.notFound('Project not found');
  return new ApiResponse(200, doc, 'Project fetched').send(res);
});

/** Parses array-ish fields sent as JSON strings from multipart forms. */
const parseArrayField = (value) => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch (_) {
    return value.split(',').map((v) => v.trim()).filter(Boolean);
  }
};

const normalizeBody = (body) => {
  const normalized = { ...body };
  ['technologies', 'developers', 'features', 'results', 'seo'].forEach((key) => {
    if (normalized[key] !== undefined) {
      const parsed = parseArrayField(normalized[key]);
      if (parsed !== undefined) normalized[key] = parsed;
    }
  });
  return normalized;
};

const create = asyncHandler(async (req, res) => {
  const body = normalizeBody(req.body);

  if (req.files?.thumbnail?.[0]) {
    const uploaded = await uploadToCloudinary(req.files.thumbnail[0].buffer, { folder: 'projects' });
    body.thumbnail = { url: uploaded.url, publicId: uploaded.publicId };
  }

  if (req.files?.gallery?.length) {
    body.gallery = await Promise.all(
      req.files.gallery.map(async (file) => {
        const uploaded = await uploadToCloudinary(file.buffer, { folder: 'projects/gallery' });
        return { url: uploaded.url, publicId: uploaded.publicId, caption: '' };
      })
    );
  }

  const doc = await Project.create(body);

  recordAuditLog({
    admin: req.admin,
    action: 'create',
    resource: 'Project',
    resourceId: doc._id,
    description: `Created project "${doc.title}"`,
    ipAddress: req.ip,
  });

  return new ApiResponse(201, doc, 'Project created successfully').send(res);
});

const update = asyncHandler(async (req, res) => {
  const body = normalizeBody(req.body);

  if (req.files?.thumbnail?.[0]) {
    const uploaded = await uploadToCloudinary(req.files.thumbnail[0].buffer, { folder: 'projects' });
    body.thumbnail = { url: uploaded.url, publicId: uploaded.publicId };
  }

  if (req.files?.gallery?.length) {
    const newImages = await Promise.all(
      req.files.gallery.map(async (file) => {
        const uploaded = await uploadToCloudinary(file.buffer, { folder: 'projects/gallery' });
        return { url: uploaded.url, publicId: uploaded.publicId, caption: '' };
      })
    );
    const existing = await Project.findById(req.params.id).select('gallery');
    body.gallery = [...(existing?.gallery || []), ...newImages];
  }

  const doc = await Project.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
  if (!doc) throw ApiError.notFound('Project not found');

  recordAuditLog({
    admin: req.admin,
    action: 'update',
    resource: 'Project',
    resourceId: doc._id,
    description: `Updated project "${doc.title}"`,
    ipAddress: req.ip,
  });

  return new ApiResponse(200, doc, 'Project updated successfully').send(res);
});

const remove = asyncHandler(async (req, res) => {
  const doc = await Project.findByIdAndDelete(req.params.id);
  if (!doc) throw ApiError.notFound('Project not found');

  recordAuditLog({
    admin: req.admin,
    action: 'delete',
    resource: 'Project',
    resourceId: doc._id,
    description: `Deleted project "${doc.title}"`,
    ipAddress: req.ip,
  });

  return new ApiResponse(200, null, 'Project deleted successfully').send(res);
});

const bulkRemove = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) throw ApiError.badRequest('Please provide ids to delete');
  const result = await Project.deleteMany({ _id: { $in: ids } });

  recordAuditLog({
    admin: req.admin,
    action: 'bulk_delete',
    resource: 'Project',
    description: `Bulk deleted ${result.deletedCount} project(s)`,
    ipAddress: req.ip,
    metadata: { ids },
  });

  return new ApiResponse(200, { deletedCount: result.deletedCount }, 'Projects deleted successfully').send(res);
});

module.exports = { list, getOne, create, update, remove, bulkRemove };
