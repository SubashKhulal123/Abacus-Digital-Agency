const multer = require('multer');
const ApiError = require('../utils/ApiError');

/**
 * Uses memoryStorage so file buffers are streamed directly to Cloudinary
 * (see utils/cloudinaryUpload.js) without ever touching the local disk —
 * important for stateless/containerized deployments.
 */
const storage = multer.memoryStorage();

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const fileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest(`Unsupported file type: ${file.mimetype}`), false);
  }
};

const imageUpload = multer({
  storage,
  fileFilter: fileFilter(ALLOWED_IMAGE_TYPES),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const documentUpload = multer({
  storage,
  fileFilter: fileFilter(ALLOWED_DOCUMENT_TYPES),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB (resumes, etc.)
});

// Used for resources needing multiple named image fields in one request,
// e.g. a project's single thumbnail plus a multi-file gallery.
const multiImageUpload = multer({
  storage,
  fileFilter: fileFilter(ALLOWED_IMAGE_TYPES),
  limits: { fileSize: 5 * 1024 * 1024, files: 12 },
});

const csvUpload = multer({
  storage,
  fileFilter: fileFilter(['text/csv', 'application/vnd.ms-excel', 'application/csv', 'text/plain']),
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = { imageUpload, documentUpload, multiImageUpload, csvUpload };
