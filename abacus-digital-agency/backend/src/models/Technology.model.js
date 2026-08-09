const mongoose = require('mongoose');
const { TECHNOLOGY_CATEGORY } = require('../constants');

const technologySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, lowercase: true, unique: true },
    icon: { type: String, default: '' }, // react-icons key or cloudinary svg url
    category: {
      type: String,
      enum: Object.values(TECHNOLOGY_CATEGORY),
      default: TECHNOLOGY_CATEGORY.OTHER,
    },
    color: { type: String, default: '#6366f1' }, // brand accent color, hex
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Technology', technologySchema);
