const mongoose = require('mongoose');

/**
 * System-generated notifications surfaced in the admin dashboard bell
 * icon — created automatically on events like a new contact message,
 * career application, or newsletter subscriber.
 */
const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error'],
      default: 'info',
    },
    link: { type: String, default: '' }, // where clicking the notification should navigate
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
