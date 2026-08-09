/**
 * Seeds the initial super-admin account using credentials from .env.
 * Run with: npm run seed:admin
 *
 * Safe to re-run — it will skip creation if an admin with that email
 * already exists instead of throwing a duplicate key error.
 */
const connectDB = require('../config/db');
const env = require('../config/env');
const logger = require('../utils/logger');
const Admin = require('../models/Admin.model');
const { ADMIN_ROLES } = require('../constants');
const mongoose = require('mongoose');

const seedAdmin = async () => {
  await connectDB();

  const existing = await Admin.findOne({ email: env.ADMIN_EMAIL });

  if (existing) {
    logger.info(`Admin already exists for ${env.ADMIN_EMAIL} — skipping seed.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const admin = await Admin.create({
    name: env.ADMIN_NAME,
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
    role: ADMIN_ROLES.SUPER_ADMIN,
    isActive: true,
  });

  logger.info(`Super admin created successfully: ${admin.email} (role: ${admin.role})`);
  logger.warn('Remember to change the default password after first login.');

  await mongoose.disconnect();
  process.exit(0);
};

seedAdmin().catch((error) => {
  logger.error(`Admin seeding failed: ${error.message}`);
  process.exit(1);
});
