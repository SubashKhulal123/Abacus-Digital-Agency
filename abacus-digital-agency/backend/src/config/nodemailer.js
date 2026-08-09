const nodemailer = require('nodemailer');
const env = require('./env');
const logger = require('../utils/logger');

/**
 * Reusable SMTP transporter. Created once and reused across the app
 * to avoid re-establishing a connection on every email send.
 */
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // true for 465, false for other ports (STARTTLS)
  auth: {
    user: env.SMTP_EMAIL,
    pass: env.SMTP_PASSWORD,
  },
});

// Verify SMTP connection at boot (non-blocking, only in dev to reduce log noise)
if (env.IS_DEV && env.SMTP_HOST) {
  transporter.verify((error) => {
    if (error) {
      logger.warn(`SMTP transporter verification failed: ${error.message}`);
    } else {
      logger.info('SMTP transporter is ready to send emails');
    }
  });
}

module.exports = transporter;
