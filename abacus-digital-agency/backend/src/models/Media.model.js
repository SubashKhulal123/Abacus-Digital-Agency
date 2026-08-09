const mongoose = require('mongoose');
const { MEDIA_TYPE } = require('../constants');

/**
 * Central record of every file uploaded through the admin panel, so the
 * Media Library UI can list/search/reuse/delete assets without querying
 * Cloudinary directly on every request.
 */
const mediaSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: Object.values(MEDIA_TYPE),
      required: true,
    },
    mimeType: { type: String, default: '' },
    sizeBytes: { type: Number, default: 0 },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    folder: { type: String, default: 'general' },
    altText: { type: String, default: '' },
    tags: [{ type: String, trim: true }],
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  },
  { timestamps: true }
);

mediaSchema.index({ folder: 1, createdAt: -1 });

module.exports = mongoose.model('Media', mediaSchema);
