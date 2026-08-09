const crypto = require('crypto');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const Newsletter = require('../models/Newsletter.model');
const Notification = require('../models/Notification.model');
const sendEmail = require('../utils/sendEmail');
const emailTemplates = require('../utils/emailTemplates');
const logger = require('../utils/logger');

/**
 * @route POST /api/v1/newsletter/subscribe
 * @access Public
 */
const subscribe = asyncHandler(async (req, res) => {
  const { email, source } = req.body;

  const existing = await Newsletter.findOne({ email });

  if (existing && existing.isSubscribed) {
    return new ApiResponse(200, null, "You're already subscribed to our newsletter.").send(res);
  }

  const unsubscribeToken = crypto.randomBytes(24).toString('hex');

  if (existing) {
    existing.isSubscribed = true;
    existing.subscribedAt = new Date();
    existing.unsubscribedAt = null;
    existing.unsubscribeToken = unsubscribeToken;
    await existing.save();
  } else {
    await Newsletter.create({
      email,
      source: source || 'website-footer',
      unsubscribeToken,
    });
  }

  const { subject: welcomeSubject, html: welcomeHtml } = emailTemplates.newsletterWelcome();
  sendEmail({
    to: email,
    subject: welcomeSubject,
    html: welcomeHtml,
  }).catch((error) => logger.error(`Newsletter welcome email failed: ${error.message}`));

  Notification.create({
    title: 'New newsletter subscriber',
    message: `${email} subscribed to the newsletter`,
    type: 'info',
    link: '/admin/newsletter',
  }).catch((error) => logger.error(`Failed to create notification: ${error.message}`));

  return new ApiResponse(201, null, 'Subscribed successfully. Welcome aboard!').send(res);
});

/**
 * @route GET /api/v1/newsletter/unsubscribe/:token
 * @access Public
 */
const unsubscribe = asyncHandler(async (req, res) => {
  const subscriber = await Newsletter.findOneAndUpdate(
    { unsubscribeToken: req.params.token },
    { isSubscribed: false, unsubscribedAt: new Date() },
    { new: true }
  );

  if (!subscriber) throw ApiError.notFound('Invalid or expired unsubscribe link');

  return new ApiResponse(200, null, 'You have been unsubscribed successfully.').send(res);
});

module.exports = { subscribe, unsubscribe };
