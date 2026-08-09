const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    isSubscribed: { type: Boolean, default: true },
    source: { type: String, default: 'website-footer' }, // where the signup happened
    subscribedAt: { type: Date, default: Date.now },
    unsubscribedAt: { type: Date, default: null },
    unsubscribeToken: { type: String, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Newsletter', newsletterSchema);
