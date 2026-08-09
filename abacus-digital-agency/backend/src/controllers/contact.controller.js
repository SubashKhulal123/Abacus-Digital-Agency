const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ContactMessage = require('../models/ContactMessage.model');
const SiteSettings = require('../models/SiteSettings.model');
const Notification = require('../models/Notification.model');
const sendEmail = require('../utils/sendEmail');
const emailTemplates = require('../utils/emailTemplates');
const logger = require('../utils/logger');

/**
 * @route POST /api/v1/contact
 * @desc  Submit the contact form. Persists the message, then fires two
 *        emails (admin notification + visitor auto-reply). Email failures
 *        are logged but never block the successful API response — the
 *        message is already safely stored either way.
 * @access Public
 */
const submitContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, company, subject, message, budgetRange, projectType } = req.body;

  const contactMessage = await ContactMessage.create({
    name,
    email,
    phone,
    company,
    subject,
    message,
    budgetRange,
    projectType,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] || '',
  });

  Notification.create({
    title: 'New contact message',
    message: `${name} sent an inquiry: "${subject}"`,
    type: 'info',
    link: `/admin/messages/${contactMessage._id}`,
  }).catch((error) => logger.error(`Failed to create notification: ${error.message}`));

  // Fire-and-forget notification emails — don't let SMTP latency/failure
  // block the visitor's response.
  (async () => {
    try {
      const settings = await SiteSettings.findOne();
      const adminEmail = settings?.contactEmail;

      if (adminEmail) {
        const { subject: adminSubject, html: adminHtml } = emailTemplates.contactAdminNotification({
          name, email, company, phone, budgetRange, projectType, subject, message,
        });
        await sendEmail({ to: adminEmail, subject: adminSubject, html: adminHtml });
      }

      const { subject: replySubject, html: replyHtml } = emailTemplates.contactAutoReply({ name, subject });
      await sendEmail({ to: email, subject: replySubject, html: replyHtml });
    } catch (error) {
      logger.error(`Contact form email dispatch failed: ${error.message}`);
    }
  })();

  return new ApiResponse(
    201,
    { id: contactMessage._id },
    "Message sent successfully. We'll be in touch soon."
  ).send(res);
});

module.exports = { submitContactMessage };
