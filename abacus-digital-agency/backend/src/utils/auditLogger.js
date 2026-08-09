const AuditLog = require('../models/AuditLog.model');
const logger = require('./logger');

/**
 * Records an admin action to the audit trail. Fire-and-forget by design —
 * a logging failure should never block or fail the admin's actual request.
 *
 * @param {Object} params
 * @param {Object} params.admin - the authenticated admin (req.admin)
 * @param {string} params.action - one of AuditLog's action enum values
 * @param {string} params.resource - human-readable resource name, e.g. "Project"
 * @param {string} [params.resourceId]
 * @param {string} params.description
 * @param {string} [params.ipAddress]
 * @param {Object} [params.metadata]
 */
const recordAuditLog = ({ admin, action, resource, resourceId, description, ipAddress, metadata }) => {
  AuditLog.create({
    admin: admin._id,
    adminName: admin.name,
    action,
    resource,
    resourceId: resourceId ? String(resourceId) : null,
    description,
    ipAddress: ipAddress || '',
    metadata: metadata || {},
  }).catch((error) => {
    logger.error(`Failed to write audit log: ${error.message}`);
  });
};

module.exports = recordAuditLog;
