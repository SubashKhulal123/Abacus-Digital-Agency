const mongoose = require('mongoose');
const { CONTACT_MESSAGE_STATUS } = require('../constants');

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, maxlength: 3000 },
    budgetRange: {
      type: String,
      enum: ['under-5k', '5k-15k', '15k-50k', '50k-plus', 'not-specified'],
      default: 'not-specified',
    },
    projectType: { type: String, default: '' },
    status: {
      type: String,
      enum: Object.values(CONTACT_MESSAGE_STATUS),
      default: CONTACT_MESSAGE_STATUS.UNREAD,
    },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    respondedAt: { type: Date, default: null },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

contactMessageSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
