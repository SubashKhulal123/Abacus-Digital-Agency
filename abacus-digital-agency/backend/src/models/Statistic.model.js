const mongoose = require('mongoose');

const statisticSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true }, // e.g. "Projects Delivered"
    value: { type: Number, required: true },
    suffix: { type: String, default: '' }, // e.g. "+", "%"
    prefix: { type: String, default: '' }, // e.g. "$"
    icon: { type: String, default: '' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

statisticSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('Statistic', statisticSchema);
