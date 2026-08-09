const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true, trim: true },
    clientDesignation: { type: String, required: true, trim: true },
    clientCompany: { type: String, required: true, trim: true },
    clientAvatar: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    message: { type: String, required: true, maxlength: 800 },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

testimonialSchema.index({ isActive: 1, isFeatured: 1, order: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);
