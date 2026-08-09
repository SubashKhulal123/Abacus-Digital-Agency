const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const CareerApplication = require('../models/CareerApplication.model');
const JobPost = require('../models/JobPost.model');
const SiteSettings = require('../models/SiteSettings.model');
const Notification = require('../models/Notification.model');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');
const sendEmail = require('../utils/sendEmail');
const emailTemplates = require('../utils/emailTemplates');
const logger = require('../utils/logger');

/**
 * @route POST /api/v1/careers/applications
 * @desc  Submit a job application (multipart/form-data with a "resume" file)
 * @access Public
 */
const submitApplication = asyncHandler(async (req, res) => {
  const jobPost = await JobPost.findOne({ _id: req.body.jobPost, isActive: true });
  if (!jobPost) {
    throw ApiError.badRequest('This job posting is no longer accepting applications');
  }

  if (!req.file) {
    throw ApiError.badRequest('A resume file is required');
  }

  const uploaded = await uploadToCloudinary(req.file.buffer, {
    folder: 'career-applications',
    resourceType: 'raw',
  });

  const application = await CareerApplication.create({
    jobPost: jobPost._id,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    resume: { url: uploaded.url, publicId: uploaded.publicId },
    coverLetter: req.body.coverLetter || '',
    portfolioUrl: req.body.portfolioUrl || '',
    linkedinUrl: req.body.linkedinUrl || '',
    experienceYears: req.body.experienceYears || 0,
    expectedSalary: req.body.expectedSalary || '',
  });

  await JobPost.findByIdAndUpdate(jobPost._id, { $inc: { applicationsCount: 1 } });

  Notification.create({
    title: 'New job application',
    message: `${req.body.name} applied for ${jobPost.title}`,
    type: 'success',
    link: `/admin/applications/${application._id}`,
  }).catch((error) => logger.error(`Failed to create notification: ${error.message}`));

  (async () => {
    try {
      const settings = await SiteSettings.findOne();
      if (settings?.contactEmail) {
        const { subject: adminSubject, html: adminHtml } = emailTemplates.applicationAdminNotification({
          name: req.body.name, email: req.body.email, jobTitle: jobPost.title, resumeUrl: uploaded.url,
        });
        await sendEmail({ to: settings.contactEmail, subject: adminSubject, html: adminHtml });
      }
      const { subject: confirmSubject, html: confirmHtml } = emailTemplates.applicationConfirmation({
        name: req.body.name, jobTitle: jobPost.title,
      });
      await sendEmail({ to: req.body.email, subject: confirmSubject, html: confirmHtml });
    } catch (error) {
      logger.error(`Career application email dispatch failed: ${error.message}`);
    }
  })();

  return new ApiResponse(
    201,
    { id: application._id },
    'Application submitted successfully. Good luck!'
  ).send(res);
});

module.exports = { submitApplication };
