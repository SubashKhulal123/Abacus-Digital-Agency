const mongoose = require('mongoose');
const { APPLICATION_STATUS } = require('../constants');

const careerApplicationSchema = new mongoose.Schema(
  {
    jobPost: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true },
    resume: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    coverLetter: { type: String, default: '', maxlength: 3000 },
    portfolioUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    experienceYears: { type: Number, default: 0 },
    expectedSalary: { type: String, default: '' },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.PENDING,
    },
    adminNotes: { type: String, default: '' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

careerApplicationSchema.index({ jobPost: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('CareerApplication', careerApplicationSchema);
