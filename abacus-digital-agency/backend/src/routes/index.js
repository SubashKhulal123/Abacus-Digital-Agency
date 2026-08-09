const express = require('express');
const authRoutes = require('./auth.routes');
const developerRoutes = require('./developer.routes');
const projectRoutes = require('./project.routes');
const serviceRoutes = require('./service.routes');
const testimonialRoutes = require('./testimonial.routes');
const blogRoutes = require('./blog.routes');
const categoryRoutes = require('./category.routes');
const technologyRoutes = require('./technology.routes');
const clientRoutes = require('./client.routes');
const contactRoutes = require('./contact.routes');
const newsletterRoutes = require('./newsletter.routes');
const jobPostRoutes = require('./jobPost.routes');
const careerApplicationRoutes = require('./careerApplication.routes');
const faqRoutes = require('./faq.routes');
const statisticRoutes = require('./statistic.routes');
const settingsRoutes = require('./settings.routes');
const adminRoutes = require('./admin/index');
const { globalSearch } = require('../controllers/search.controller');
const maintenanceMode = require('../middlewares/maintenanceMode.middleware');
const cacheControl = require('../middlewares/cacheControl.middleware');
const ApiResponse = require('../utils/ApiResponse');

const router = express.Router();

/**
 * @route   GET /api/v1/health
 * @desc    Health check — used by uptime monitors / load balancers
 * @access  Public
 */
router.get('/health', (req, res) => {
  new ApiResponse(200, { uptime: process.uptime(), timestamp: Date.now() }, 'API is healthy').send(
    res
  );
});

// Mounted BEFORE the maintenance-mode gate below, so admins can always
// authenticate and manage the site — including turning maintenance mode
// back off — even while it's active for everyone else. /settings is also
// exempted because it's the endpoint the frontend uses to detect
// maintenance mode and render the correct branded message in the first
// place — gating it would create a chicken-and-egg problem.
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/settings', cacheControl(60), settingsRoutes);

// Every route registered from here down is gated by maintenance mode.
router.use(maintenanceMode);

router.get('/search', cacheControl(30), globalSearch);
router.use('/developers', cacheControl(120), developerRoutes);
router.use('/projects', cacheControl(60), projectRoutes);
router.use('/services', cacheControl(300), serviceRoutes);
router.use('/testimonials', cacheControl(300), testimonialRoutes);
router.use('/blogs', cacheControl(60), blogRoutes);
router.use('/categories', cacheControl(600), categoryRoutes);
router.use('/technologies', cacheControl(600), technologyRoutes);
router.use('/clients', cacheControl(600), clientRoutes);
router.use('/contact', contactRoutes); // write endpoint — never cached
router.use('/newsletter', newsletterRoutes); // write endpoint — never cached
router.use('/careers/jobs', cacheControl(120), jobPostRoutes);
router.use('/careers/applications', careerApplicationRoutes); // write endpoint — never cached
router.use('/faqs', cacheControl(600), faqRoutes);
router.use('/statistics', cacheControl(300), statisticRoutes);

/**
 * ------------------------------------------------------------------
 * Admin-only CRUD (create/update/delete) routes for every resource
 * above, plus the Media Library, Dashboard analytics, Audit Logs,
 * Notifications, Backup, and Logs are all live under /api/v1/admin —
 * see src/docs/API_ENDPOINTS.md for the full admin endpoint reference.
 * ------------------------------------------------------------------
 */

module.exports = router;
