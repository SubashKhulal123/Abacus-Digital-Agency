const mongoose = require('mongoose');
const { CONTENT_STATUS } = require('../constants');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    shortDescription: { type: String, required: true, maxlength: 220 },
    description: { type: String, required: true },
    thumbnail: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    gallery: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        caption: { type: String, default: '' },
      },
    ],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    technologies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Technology' }],
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', default: null },
    developers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Developer' }],
    liveUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    features: [{ type: String }],
    challenges: { type: String, default: '' },
    solutions: { type: String, default: '' },
    results: [{ metric: String, value: String }], // e.g. { metric: "Page Load Time", value: "-64%" }
    durationWeeks: { type: Number, default: null },
    teamSize: { type: Number, default: null },
    completedAt: { type: Date, default: null },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(CONTENT_STATUS),
      default: CONTENT_STATUS.DRAFT,
    },
    views: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      keywords: [{ type: String }],
      ogImage: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

projectSchema.index({ status: 1, isFeatured: 1, order: 1 });
projectSchema.index({ title: 'text', shortDescription: 'text' });

module.exports = mongoose.model('Project', projectSchema);
