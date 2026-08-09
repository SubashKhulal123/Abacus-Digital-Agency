const mongoose = require('mongoose');
const { THEME_NAMES } = require('../constants');

/**
 * Singleton document — only ONE SiteSettings document should ever exist.
 * Enforced at the service layer via findOneAndUpdate(..., { upsert: true }).
 * Drives global, admin-controlled site configuration: branding, contact
 * info, social links, SEO defaults, and theme system defaults.
 */
const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'Abacus Digital Agency' },
    tagline: { type: String, default: 'We engineer digital experiences that convert.' },
    logo: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    logoDark: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    favicon: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    address: { type: String, default: '' },
    socialLinks: {
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      instagram: { type: String, default: '' },
      dribbble: { type: String, default: '' },
      behance: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    seoDefaults: {
      title: { type: String, default: 'Abacus Digital Agency — Product Design & Engineering Studio' },
      description: { type: String, default: '' },
      keywords: [{ type: String }],
      ogImage: { type: String, default: '' },
    },
    themeSettings: {
      defaultMode: { type: String, enum: ['light', 'dark'], default: 'dark' },
      defaultTheme: {
        type: String,
        enum: Object.values(THEME_NAMES),
        default: THEME_NAMES.MIDNIGHT_VIOLET,
      },
      availableThemes: {
        type: [String],
        default: Object.values(THEME_NAMES),
      },
    },
    maintenanceMode: {
      isEnabled: { type: Boolean, default: false },
      message: { type: String, default: 'We are currently performing scheduled maintenance. Please check back shortly.' },
    },
    analytics: {
      googleAnalyticsId: { type: String, default: '' },
      googleTagManagerId: { type: String, default: '' },
    },
    footerText: { type: String, default: '' },

    // ------------------------------------------------------------------
    // Extended marketing content — CMS-editable copy for homepage/about
    // sections that are singleton blocks rather than repeatable resources.
    // ------------------------------------------------------------------
    aboutContent: {
      story: { type: String, default: '' },
      mission: { type: String, default: '' },
      vision: { type: String, default: '' },
    },
    heroContent: {
      badge: { type: String, default: '' },
      title: { type: String, default: '' },
      highlight: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      primaryCtaLabel: { type: String, default: 'Start a Project' },
      primaryCtaLink: { type: String, default: '/contact' },
      secondaryCtaLabel: { type: String, default: 'View Our Work' },
      secondaryCtaLink: { type: String, default: '/portfolio' },
    },
    values: [
      {
        icon: { type: String, default: '' },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    whyChooseUs: [
      {
        icon: { type: String, default: '' },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    processSteps: [
      {
        step: { type: Number, required: true },
        icon: { type: String, default: '' },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    industries: [
      {
        icon: { type: String, default: '' },
        name: { type: String, required: true },
        description: { type: String, default: '' },
      },
    ],
    pricingPlans: [
      {
        name: { type: String, required: true },
        description: { type: String, default: '' },
        price: { type: Number, default: null },
        currency: { type: String, default: 'USD' },
        billingNote: { type: String, default: 'starting at' }, // e.g. "starting at", "/month"
        features: [{ type: String }],
        isPopular: { type: Boolean, default: false },
        ctaLabel: { type: String, default: 'Get Started' },
        order: { type: Number, default: 0 },
      },
    ],
    awards: [
      {
        title: { type: String, required: true },
        organization: { type: String, required: true },
        year: { type: Number, required: true },
        icon: { type: String, default: '' },
      },
    ],
    timeline: [
      {
        year: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    openSource: {
      title: { type: String, default: 'Open Source' },
      description: { type: String, default: '' },
      repositories: [
        {
          name: { type: String, required: true },
          description: { type: String, default: '' },
          url: { type: String, required: true },
          stars: { type: Number, default: 0 },
          language: { type: String, default: '' },
        },
      ],
    },
    community: {
      title: { type: String, default: 'Community' },
      description: { type: String, default: '' },
      links: [
        {
          label: { type: String, required: true },
          url: { type: String, required: true },
          icon: { type: String, default: '' },
        },
      ],
    },
    partners: [
      {
        name: { type: String, required: true },
        logo: {
          url: { type: String, default: '' },
          publicId: { type: String, default: '' },
        },
        url: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
