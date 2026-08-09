const mongoose = require('mongoose');
const { JOB_TYPE } = require('../constants');

const jobPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    department: { type: String, required: true, trim: true }, // e.g. "Engineering"
    type: {
      type: String,
      enum: Object.values(JOB_TYPE),
      required: true,
    },
    location: { type: String, required: true, trim: true }, // e.g. "Remote", "Kathmandu, NP"
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead'],
      default: 'mid',
    },
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    niceToHave: [{ type: String }],
    salaryRange: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      currency: { type: String, default: 'USD' },
      isPublic: { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true },
    applicationDeadline: { type: Date, default: null },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    applicationsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

jobPostSchema.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model('JobPost', jobPostSchema);
