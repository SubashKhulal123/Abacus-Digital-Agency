const mongoose = require('mongoose');
const { CONTENT_STATUS } = require('../constants');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    excerpt: { type: String, required: true, maxlength: 260 },
    content: { type: String, required: true }, // rich text / markdown HTML
    coverImage: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    tags: [{ type: String, trim: true }],
    readTimeMinutes: { type: Number, default: 5 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(CONTENT_STATUS),
      default: CONTENT_STATUS.DRAFT,
    },
    publishedAt: { type: Date, default: null },
    isFeatured: { type: Boolean, default: false },
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      keywords: [{ type: String }],
      ogImage: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ title: 'text', excerpt: 'text', tags: 'text' });

module.exports = mongoose.model('Blog', blogSchema);
