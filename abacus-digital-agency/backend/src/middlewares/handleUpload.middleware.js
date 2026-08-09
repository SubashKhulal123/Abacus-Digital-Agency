const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Composable middleware: if a file was uploaded under `multerFieldName`
 * (via a preceding multer middleware), uploads it to Cloudinary and
 * attaches the result to req.body[bodyFieldName] as { url, publicId } —
 * so downstream generic CRUD controllers can just save req.body as-is.
 *
 * If old asset info is present on req.body[`${bodyFieldName}Old`] (sent
 * by the frontend on update so we know what to clean up), it's deleted
 * from Cloudinary after the new upload succeeds.
 *
 * @param {string} multerFieldName - the multipart field name, e.g. "avatar"
 * @param {string} folder - Cloudinary subfolder, e.g. "developers"
 * @param {string} [bodyFieldName] - defaults to multerFieldName
 */
const handleImageUpload = (multerFieldName, folder, bodyFieldName = multerFieldName) =>
  asyncHandler(async (req, res, next) => {
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, { folder, resourceType: 'image' });
      req.body[bodyFieldName] = { url: uploaded.url, publicId: uploaded.publicId };
    } else if (typeof req.body[bodyFieldName] === 'string') {
      // Multipart forms stringify nested objects — parse back if it's JSON
      try {
        req.body[bodyFieldName] = JSON.parse(req.body[bodyFieldName]);
      } catch (_) {
        delete req.body[bodyFieldName];
      }
    }
    next();
  });

module.exports = { handleImageUpload, deleteFromCloudinary };
