const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    website: { type: String, default: '' },
    industry: { type: String, default: '' },
    testimonial: { type: mongoose.Schema.Types.ObjectId, ref: 'Testimonial', default: null },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Client', clientSchema);
