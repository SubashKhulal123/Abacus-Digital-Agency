/**
 * Centralized environment configuration.
 * Every environment variable used across the application MUST be read
 * through this file. Never call `process.env.X` directly anywhere else —
 * this keeps the codebase safe from typos, undefined values, and makes
 * required variables fail fast at boot time instead of at runtime.
 */
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const REQUIRED_VARS = [
  'MONGO_URI',
  'JWT_SECRET',
  'COOKIE_SECRET',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.error(
      `\n[ENV ERROR] Missing required environment variables: ${missing.join(', ')}\n` +
        'Please copy .env.example to .env and fill in the values before starting the server.\n'
    );
    process.exit(1);
  }
}

validateEnv();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  MONGO_URI: process.env.MONGO_URI,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  JWT_COOKIE_EXPIRE: parseInt(process.env.JWT_COOKIE_EXPIRE, 10) || 7,
  COOKIE_SECRET: process.env.COOKIE_SECRET,

  ADMIN_NAME: process.env.ADMIN_NAME || 'Super Admin',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || 'Abacus Digital Agency',
  SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || process.env.SMTP_EMAIL,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  RATE_LIMIT_WINDOW_MINUTES: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES, 10) || 15,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 200,

  IS_PROD: process.env.NODE_ENV === 'production',
  IS_DEV: process.env.NODE_ENV !== 'production',
};

module.exports = env;
