/**
 * Seeds the singleton SiteSettings document if one doesn't already exist.
 * Run with: npm run seed:settings
 */
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const logger = require('../utils/logger');
const SiteSettings = require('../models/SiteSettings.model');
const { THEME_NAMES } = require('../constants');

const seedSiteSettings = async () => {
  await connectDB();

  const existing = await SiteSettings.findOne();

  if (existing) {
    logger.info('Site settings document already exists — skipping seed.');
    await mongoose.disconnect();
    process.exit(0);
  }

  const settings = await SiteSettings.create({
    siteName: 'Abacus Digital Agency',
    tagline: 'We engineer digital experiences that convert.',
    contactEmail: 'hello@abacusdigital.agency',
    contactPhone: '+1 (415) 555-0198',
    address: 'San Francisco, CA — Remote-first, global team',
    socialLinks: {
      twitter: 'https://twitter.com/abacusdigital',
      linkedin: 'https://linkedin.com/company/abacusdigital',
      github: 'https://github.com/abacusdigital',
      instagram: 'https://instagram.com/abacusdigital',
      dribbble: 'https://dribbble.com/abacusdigital',
      behance: '',
      youtube: '',
    },
    seoDefaults: {
      title: 'Abacus Digital Agency — Product Design & Engineering Studio',
      description:
        'Abacus Digital Agency designs and builds high-performance web platforms, brands, and products for ambitious companies worldwide.',
      keywords: [
        'digital agency',
        'web development agency',
        'product design studio',
        'react development',
        'ui ux design agency',
      ],
      ogImage: '',
    },
    themeSettings: {
      defaultMode: 'dark',
      defaultTheme: THEME_NAMES.MIDNIGHT_VIOLET,
      availableThemes: Object.values(THEME_NAMES),
    },
    footerText: `© ${new Date().getFullYear()} Abacus Digital Agency. Crafted with precision.`,
  });

  logger.info(`Site settings seeded successfully (id: ${settings._id})`);

  await mongoose.disconnect();
  process.exit(0);
};

seedSiteSettings().catch((error) => {
  logger.error(`Site settings seeding failed: ${error.message}`);
  process.exit(1);
});
