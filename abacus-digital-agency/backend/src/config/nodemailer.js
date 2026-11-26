

// const nodemailer = require('nodemailer');
// const env = require('./env');
// const logger = require('../utils/logger');

// console.log('[SMTP DEBUG]', {
//   host: env.SMTP_HOST,
//   port: env.SMTP_PORT,
//   email: env.SMTP_EMAIL,
//   passwordExists: Boolean(env.SMTP_PASSWORD),
//   passwordLength: env.SMTP_PASSWORD
//     ? env.SMTP_PASSWORD.length
//     : 0,
// });

// /**
//  * Reusable SMTP transporter. Created once and reused across the app
//  * to avoid re-establishing a connection on every email send.
//  */
// const transporter = nodemailer.createTransport({
//   host: env.SMTP_HOST,
//   port: env.SMTP_PORT,
//   secure: env.SMTP_PORT === 465,
//   auth: {
//     user: env.SMTP_EMAIL,
//     pass: env.SMTP_PASSWORD,
//   },
// });

// // Verify SMTP connection at boot
// if (env.IS_DEV && env.SMTP_HOST) {
//   transporter.verify((error) => {
//     if (error) {
//       logger.warn(`SMTP transporter verification failed: ${error.message}`);
//     } else {
//       logger.info('SMTP transporter is ready to send emails');
//     }
//   });
// }

// module.exports = transporter;