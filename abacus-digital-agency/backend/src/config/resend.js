const { Resend } = require('resend');
const env = require('./env');
const logger = require('../utils/logger');

// Initialize Resend client
const resend = new Resend(env.RESEND_API_KEY);

// Log config (without exposing full API key)
console.log('[RESEND DEBUG]', {
  apiKeyExists: Boolean(env.RESEND_API_KEY),
  apiKeyLength: env.RESEND_API_KEY ? env.RESEND_API_KEY.length : 0,
  fromEmail: env.RESEND_FROM_EMAIL,
  fromName: env.RESEND_FROM_NAME,
});

// Verify connection (Resend doesn't have a built-in verify, so we'll check API key exists)
if (env.IS_DEV && env.RESEND_API_KEY) {
  // Resend doesn't have a simple verify endpoint, so we just log
  logger.info('Resend client initialized');
}

module.exports = resend;