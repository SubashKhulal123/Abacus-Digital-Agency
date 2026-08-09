const mongoose = require('mongoose');
const { CATEGORY_TYPE } = require('../constants');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    slug: { type: String, required: true, lowercase: true, index: true },
    type: {
      type: String,
      enum: Object.values(CATEGORY_TYPE),
      required: true,
    },
    description: { type: String, maxlength: 300, default: '' },
    icon: { type: String, default: '' }, // icon key/name (e.g. react-icons identifier)
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// A slug must be unique per type (blog / project), not globally
categorySchema.index({ slug: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
