const express = require('express');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const { ADMIN_ROLES } = require('../../constants');

const dashboardRoutes = require('./dashboard.routes');
const developersRoutes = require('./developers.routes');
const projectsRoutes = require('./projects.routes');
const servicesRoutes = require('./services.routes');
const blogsRoutes = require('./blogs.routes');
const testimonialsRoutes = require('./testimonials.routes');
const clientsRoutes = require('./clients.routes');
const technologiesRoutes = require('./technologies.routes');
const categoriesRoutes = require('./categories.routes');
const faqsRoutes = require('./faqs.routes');
const statisticsRoutes = require('./statistics.routes');
const jobPostsRoutes = require('./jobPosts.routes');
const careerApplicationsRoutes = require('./careerApplications.routes');
const contactMessagesRoutes = require('./contactMessages.routes');
const newsletterRoutes = require('./newsletter.routes');
const mediaRoutes = require('./media.routes');
const settingsRoutes = require('./settings.routes');
const auditLogsRoutes = require('./auditLogs.routes');
const notificationsRoutes = require('./notifications.routes');
const backupRoutes = require('./backup.routes');
const logsRoutes = require('./logs.routes');

const router = express.Router();

// Every route below requires a valid admin session with at least the
// "editor" role. Individual routes can layer stricter role checks
// (e.g. super-admin-only) on top of this baseline.
router.use(protect, authorize(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN, ADMIN_ROLES.EDITOR));

router.use('/dashboard', dashboardRoutes);
router.use('/developers', developersRoutes);
router.use('/projects', projectsRoutes);
router.use('/services', servicesRoutes);
router.use('/blogs', blogsRoutes);
router.use('/testimonials', testimonialsRoutes);
router.use('/clients', clientsRoutes);
router.use('/technologies', technologiesRoutes);
router.use('/categories', categoriesRoutes);
router.use('/faqs', faqsRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/jobs', jobPostsRoutes);
router.use('/applications', careerApplicationsRoutes);
router.use('/messages', contactMessagesRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/media', mediaRoutes);
router.use('/settings', settingsRoutes);
router.use('/audit-logs', auditLogsRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/backup', backupRoutes);
router.use('/logs', logsRoutes);

module.exports = router;
