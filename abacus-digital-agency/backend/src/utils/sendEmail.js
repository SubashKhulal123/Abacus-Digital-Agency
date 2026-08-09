const transporter = require('../config/nodemailer');
const env = require('../config/env');
const logger = require('../utils/logger');
const ApiError = require('./ApiError');

/**
 * Wraps raw HTML content in a consistent, branded email shell so every
 * transactional email (contact form receipt, newsletter, job application
 * confirmation, admin alerts) shares the same premium look.
 */
const baseTemplate = (title, bodyHtml) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#0a0a0f;font-family:'Helvetica Neue',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0f;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#13131a;border-radius:16px;overflow:hidden;border:1px solid #232330;">
            <tr>
              <td style="padding:32px 40px;background:linear-gradient(135deg,#6d28d9,#4f46e5);">
                <span style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.5px;">ABACUS DIGITAL AGENCY</span>
              </td>
            </tr>
            <tr>
              <td style="padding:40px;color:#e4e4e7;font-size:15px;line-height:1.7;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 40px;background-color:#0f0f16;color:#71717a;font-size:12px;">
                &copy; ${new Date().getFullYear()} Abacus Digital Agency. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

/**
 * Sends a transactional email via the configured SMTP transporter.
 * @param {Object} params
 * @param {string} params.to
 * @param {string} params.subject
 * @param {string} params.html - inner body HTML (will be wrapped in baseTemplate)
 * @param {boolean} [params.raw] - if true, sends `html` as-is without the branded wrapper
 */
const sendEmail = async ({ to, subject, html, raw = false }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html: raw ? html : baseTemplate(subject, html),
    });
    logger.info(`Email sent to ${to} — messageId: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    throw ApiError.internal('Failed to send email');
  }
};

module.exports = sendEmail;
