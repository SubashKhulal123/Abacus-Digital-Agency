const asyncHandler = require('../../utils/asyncHandler');
const recordAuditLog = require('../../utils/auditLogger');

const Developer = require('../../models/Developer.model');
const Project = require('../../models/Project.model');
const Service = require('../../models/Service.model');
const Testimonial = require('../../models/Testimonial.model');
const Blog = require('../../models/Blog.model');
const Category = require('../../models/Category.model');
const Technology = require('../../models/Technology.model');
const Client = require('../../models/Client.model');
const FAQ = require('../../models/FAQ.model');
const Statistic = require('../../models/Statistic.model');
const JobPost = require('../../models/JobPost.model');
const SiteSettings = require('../../models/SiteSettings.model');

/**
 * @route GET /api/v1/admin/backup
 * @desc  Exports every public-content collection as a single downloadable
 *        JSON file — a lightweight, portable backup that doesn't require
 *        shell access to run `mongodump` (which isn't available from an
 *        HTTP endpoint in most hosting environments anyway). Excludes
 *        Admin accounts, contact messages, and applications (PII) by
 *        design — this is a content backup, not a full data export.
 * @access Super Admin only
 */
const createBackup = asyncHandler(async (req, res) => {
  const [
    developers, projects, services, testimonials, blogs,
    categories, technologies, clients, faqs, statistics, jobPosts, settings,
  ] = await Promise.all([
    Developer.find({}).lean(),
    Project.find({}).lean(),
    Service.find({}).lean(),
    Testimonial.find({}).lean(),
    Blog.find({}).lean(),
    Category.find({}).lean(),
    Technology.find({}).lean(),
    Client.find({}).lean(),
    FAQ.find({}).lean(),
    Statistic.find({}).lean(),
    JobPost.find({}).lean(),
    SiteSettings.find({}).lean(),
  ]);

  const backup = {
    meta: {
      generatedAt: new Date().toISOString(),
      generatedBy: req.admin.email,
      version: 1,
    },
    data: {
      developers, projects, services, testimonials, blogs,
      categories, technologies, clients, faqs, statistics, jobPosts, settings,
    },
  };

  recordAuditLog({
    admin: req.admin,
    action: 'backup',
    resource: 'Database',
    description: 'Generated a full content backup export',
    ipAddress: req.ip,
  });

  const filename = `abacus-backup-${new Date().toISOString().slice(0, 10)}.json`;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(JSON.stringify(backup, null, 2));
});

module.exports = { createBackup };
