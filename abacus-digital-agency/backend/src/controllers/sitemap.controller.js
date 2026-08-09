const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');
const Project = require('../models/Project.model');
const Blog = require('../models/Blog.model');
const Service = require('../models/Service.model');
const JobPost = require('../models/JobPost.model');

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'weekly' },
  { path: '/portfolio', priority: '0.9', changefreq: 'weekly' },
  { path: '/blog', priority: '0.8', changefreq: 'daily' },
  { path: '/careers', priority: '0.6', changefreq: 'weekly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
];

const urlEntry = (loc, lastmod, priority, changefreq) => `
  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

/**
 * @route GET /sitemap.xml
 * @desc  Dynamically generates a sitemap covering static routes plus every
 *        published project/blog/active service/active job — so the
 *        sitemap always reflects real, current content instead of going
 *        stale the moment an admin publishes something new.
 * @access Public
 */
const getSitemap = asyncHandler(async (req, res) => {
  const baseUrl = env.CLIENT_URL.replace(/\/$/, '');

  const [projects, blogs, services, jobs] = await Promise.all([
    Project.find({ status: 'published' }).select('slug updatedAt').lean(),
    Blog.find({ status: 'published' }).select('slug updatedAt').lean(),
    Service.find({ isActive: true }).select('slug updatedAt').lean(),
    JobPost.find({ isActive: true }).select('slug updatedAt').lean(),
  ]);

  let urls = STATIC_ROUTES.map((r) => urlEntry(`${baseUrl}${r.path}`, null, r.priority, r.changefreq)).join('');
  urls += projects.map((p) => urlEntry(`${baseUrl}/portfolio/${p.slug}`, p.updatedAt, '0.7', 'monthly')).join('');
  urls += blogs.map((b) => urlEntry(`${baseUrl}/blog/${b.slug}`, b.updatedAt, '0.6', 'monthly')).join('');
  urls += services.map((s) => urlEntry(`${baseUrl}/services/${s.slug}`, s.updatedAt, '0.7', 'monthly')).join('');
  urls += jobs.map((j) => urlEntry(`${baseUrl}/careers/${j.slug}`, j.updatedAt, '0.5', 'weekly')).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour — content-derived, doesn't need to be instant
  res.status(200).send(xml);
});

/**
 * @route GET /robots.txt
 * @access Public
 */
const getRobotsTxt = (req, res) => {
  const baseUrl = env.CLIENT_URL.replace(/\/$/, '');
  const content = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(content);
};

module.exports = { getSitemap, getRobotsTxt };
