const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const ApiFeatures = require('../../utils/ApiFeatures');
const recordAuditLog = require('../../utils/auditLogger');
const { uploadToCloudinary, deleteFromCloudinary } = require('../../utils/cloudinaryUpload');
const Media = require('../../models/Media.model');

const list = asyncHandler(async (req, res) => {
  const query = Media.find({});
  const features = new ApiFeatures(query, req.query)
    .filter()
    .search(['fileName', 'altText', 'tags'])
    .sort('-createdAt')
    .limitFields();

  await features.paginate(24);
  const results = await features.query;

  return new ApiResponse(200, results, 'Media fetched', features.meta).send(res);
});

const upload = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('Please select a file to upload');

  const folder = req.body.folder || 'media-library';
  const uploaded = await uploadToCloudinary(req.file.buffer, { folder, resourceType: 'image' });

  const media = await Media.create({
    fileName: req.file.originalname,
    url: uploaded.url,
    publicId: uploaded.publicId,
    type: 'image',
    mimeType: req.file.mimetype,
    sizeBytes: uploaded.bytes,
    width: uploaded.width,
    height: uploaded.height,
    folder,
    altText: req.body.altText || '',
    tags: req.body.tags ? req.body.tags.split(',').map((t) => t.trim()) : [],
    uploadedBy: req.admin._id,
  });

  recordAuditLog({
    admin: req.admin,
    action: 'create',
    resource: 'Media',
    resourceId: media._id,
    description: `Uploaded media file "${media.fileName}"`,
    ipAddress: req.ip,
  });

  return new ApiResponse(201, media, 'File uploaded successfully').send(res);
});

const remove = asyncHandler(async (req, res) => {
  const doc = await Media.findById(req.params.id);
  if (!doc) throw ApiError.notFound('Media file not found');

  await deleteFromCloudinary(doc.publicId, doc.type);
  await doc.deleteOne();

  recordAuditLog({
    admin: req.admin,
    action: 'delete',
    resource: 'Media',
    resourceId: doc._id,
    description: `Deleted media file "${doc.fileName}"`,
    ipAddress: req.ip,
  });

  return new ApiResponse(200, null, 'Media file deleted successfully').send(res);
});

const bulkRemove = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) throw ApiError.badRequest('Please provide ids to delete');

  const docs = await Media.find({ _id: { $in: ids } });
  await Promise.all(docs.map((doc) => deleteFromCloudinary(doc.publicId, doc.type).catch(() => null)));
  const result = await Media.deleteMany({ _id: { $in: ids } });

  recordAuditLog({
    admin: req.admin,
    action: 'bulk_delete',
    resource: 'Media',
    description: `Bulk deleted ${result.deletedCount} media file(s)`,
    ipAddress: req.ip,
  });

  return new ApiResponse(200, { deletedCount: result.deletedCount }, 'Media files deleted successfully').send(res);
});

module.exports = { list, upload, remove, bulkRemove };
