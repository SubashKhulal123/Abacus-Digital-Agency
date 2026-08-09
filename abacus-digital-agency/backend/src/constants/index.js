/**
 * Centralized constant values (enums, roles, statuses) used across
 * models, controllers and validators. Keeping them here prevents
 * "magic string" drift between files.
 */

const ADMIN_ROLES = Object.freeze({
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  EDITOR: 'editor',
});

const CONTENT_STATUS = Object.freeze({
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
});

const CONTACT_MESSAGE_STATUS = Object.freeze({
  UNREAD: 'unread',
  READ: 'read',
  REPLIED: 'replied',
  ARCHIVED: 'archived',
});

const APPLICATION_STATUS = Object.freeze({
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  SHORTLISTED: 'shortlisted',
  INTERVIEWING: 'interviewing',
  REJECTED: 'rejected',
  HIRED: 'hired',
});

const JOB_TYPE = Object.freeze({
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship',
  REMOTE: 'remote',
});

const CATEGORY_TYPE = Object.freeze({
  BLOG: 'blog',
  PROJECT: 'project',
});

const TECHNOLOGY_CATEGORY = Object.freeze({
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  DATABASE: 'database',
  DEVOPS: 'devops',
  DESIGN: 'design',
  MOBILE: 'mobile',
  OTHER: 'other',
});

const MEDIA_TYPE = Object.freeze({
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'document',
});

const THEME_NAMES = Object.freeze({
  MIDNIGHT_VIOLET: 'midnight-violet',
  ELECTRIC_BLUE: 'electric-blue',
  EMERALD_NOIR: 'emerald-noir',
  SUNSET_AMBER: 'sunset-amber',
  CRIMSON_STEEL: 'crimson-steel',
});

const COOKIE_NAME = 'token';

module.exports = {
  ADMIN_ROLES,
  CONTENT_STATUS,
  CONTACT_MESSAGE_STATUS,
  APPLICATION_STATUS,
  JOB_TYPE,
  CATEGORY_TYPE,
  TECHNOLOGY_CATEGORY,
  MEDIA_TYPE,
  THEME_NAMES,
  COOKIE_NAME,
};
