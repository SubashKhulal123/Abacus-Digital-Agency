const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');

const Project = require('../../models/Project.model');
const Blog = require('../../models/Blog.model');
const Service = require('../../models/Service.model');
const Developer = require('../../models/Developer.model');
const Testimonial = require('../../models/Testimonial.model');
const ContactMessage = require('../../models/ContactMessage.model');
const Newsletter = require('../../models/Newsletter.model');
const CareerApplication = require('../../models/CareerApplication.model');
const JobPost = require('../../models/JobPost.model');
const Media = require('../../models/Media.model');
const AuditLog = require('../../models/AuditLog.model');

/**
 * Deterministic pseudo-random series generator (seeded by day index) so
 * the placeholder traffic/revenue charts look consistent across refreshes
 * within the same day rather than jumping around randomly, while making
 * unmistakably clear via the response `isPlaceholder: true` flag that
 * this is NOT real analytics data — no analytics provider is integrated.
 */
const generatePlaceholderSeries = (days, base, variance) => {
  const series = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const seed = date.getDate() + date.getMonth() * 31;
    const pseudoRandom = Math.abs(Math.sin(seed)) ;
    series.push({
      date: date.toISOString().slice(0, 10),
      value: Math.round(base + pseudoRandom * variance),
    });
  }
  return series;
};

/**
 * @route GET /api/v1/admin/dashboard
 * @desc  Aggregate dashboard stats: real counts from MongoDB, recent
 *        activity from the audit log, and clearly-flagged placeholder
 *        traffic/revenue series for the chart widgets.
 */
const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalProjects,
    publishedProjects,
    totalBlogs,
    publishedBlogs,
    totalServices,
    totalDevelopers,
    totalTestimonials,
    unreadMessages,
    totalMessages,
    totalSubscribers,
    pendingApplications,
    totalApplications,
    activeJobs,
    totalMedia,
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ status: 'published' }),
    Blog.countDocuments(),
    Blog.countDocuments({ status: 'published' }),
    Service.countDocuments({ isActive: true }),
    Developer.countDocuments({ isActive: true }),
    Testimonial.countDocuments({ isActive: true }),
    ContactMessage.countDocuments({ status: 'unread' }),
    ContactMessage.countDocuments(),
    Newsletter.countDocuments({ isSubscribed: true }),
    CareerApplication.countDocuments({ status: 'pending' }),
    CareerApplication.countDocuments(),
    JobPost.countDocuments({ isActive: true }),
    Media.countDocuments(),
  ]);

  const recentActivity = await AuditLog.find({})
    .sort('-createdAt')
    .limit(10)
    .select('adminName action resource description createdAt');

  const topProjects = await Project.find({ status: 'published' })
    .sort('-views')
    .limit(5)
    .select('title views slug');

  const topBlogs = await Blog.find({ status: 'published' })
    .sort('-views')
    .limit(5)
    .select('title views slug');

  const dashboard = {
    summary: {
      totalProjects,
      publishedProjects,
      totalBlogs,
      publishedBlogs,
      totalServices,
      totalDevelopers,
      totalTestimonials,
      unreadMessages,
      totalMessages,
      totalSubscribers,
      pendingApplications,
      totalApplications,
      activeJobs,
      totalMedia,
    },
    recentActivity,
    topProjects,
    topBlogs,
    charts: {
      isPlaceholder: true,
      placeholderNotice:
        'Traffic and revenue charts show simulated data — connect Google Analytics or another analytics provider under Settings → SEO & Analytics to replace these with real numbers.',
      visitors: generatePlaceholderSeries(30, 800, 600),
      pageViews: generatePlaceholderSeries(30, 2200, 1400),
      revenue: generatePlaceholderSeries(12, 18000, 12000),
    },
  };

  return new ApiResponse(200, dashboard, 'Dashboard data fetched').send(res);
});

module.exports = { getDashboard };
