const mongoose = require('mongoose');

const developerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    designation: { type: String, required: true, trim: true }, // e.g. "Lead Frontend Engineer"
    bio: { type: String, required: true, maxlength: 1000 },
    avatar: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    email: { type: String, trim: true, lowercase: true },
    skills: [{ type: String, trim: true }],
    technologies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Technology' }],
    experienceYears: { type: Number, default: 0, min: 0 },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      dribbble: { type: String, default: '' },
    },
    department: {
      type: String,
      enum: ['engineering', 'design', 'marketing', 'management', 'qa'],
      default: 'engineering',
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

developerSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('Developer', developerSchema);
