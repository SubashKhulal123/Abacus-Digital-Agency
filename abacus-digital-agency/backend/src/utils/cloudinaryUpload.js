const { Readable } = require('stream');
const cloudinary = require('../config/cloudinary');
const ApiError = require('./ApiError');
const logger = require('./logger');

/**
 * Uploads a file buffer (from multer memoryStorage) to Cloudinary.
 *
 * @param {Buffer} fileBuffer - raw file buffer from multer
 * @param {Object} options
 * @param {string} options.folder - Cloudinary folder, e.g. "abacus/projects"
 * @param {string} [options.resourceType] - "image" | "video" | "raw" | "auto"
 * @param {string} [options.publicId] - optional custom public_id
 * @returns {Promise<{url: string, publicId: string, width: number, height: number, format: string}>}
 */
const uploadToCloudinary = (fileBuffer, { folder, resourceType = 'auto', publicId } = {}) => {
  if (!folder) throw ApiError.internal('Cloudinary upload requires a target folder');

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `abacus-digital-agency/${folder}`,
        resource_type: resourceType,
        public_id: publicId,
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          logger.error(`Cloudinary upload failed: ${error.message}`);
          return reject(ApiError.internal('File upload to Cloudinary failed'));
        }
        return resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    const readable = new Readable();
    readable.push(fileBuffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

/**
 * Deletes an asset from Cloudinary by its public_id.
 * @param {string} publicId
 * @param {string} [resourceType] - "image" | "video" | "raw"
 */
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return null;
  try {
    return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    logger.error(`Cloudinary deletion failed for ${publicId}: ${error.message}`);
    throw ApiError.internal('Failed to delete file from Cloudinary');
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
