const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    icon: { type: String, default: '' }, // react-icons key
    shortDescription: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true },
    coverImage: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    features: [{ type: String }],
    process: [
      {
        step: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    technologies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Technology' }],
    pricing: {
      model: {
        type: String,
        enum: ['fixed', 'hourly', 'custom-quote'],
        default: 'custom-quote',
      },
      startingPrice: { type: Number, default: null },
      currency: { type: String, default: 'USD' },
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    seo: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      keywords: [{ type: String }],
    },
  },
  { timestamps: true }
);

serviceSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('Service', serviceSchema);
