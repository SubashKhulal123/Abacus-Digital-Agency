const mongoose = require('mongoose');

/**
 * Immutable trail of every admin mutation (create/update/delete/login).
 * Powers the "Audit Logs" admin screen and the dashboard's recent
 * activity feed.
 */
const auditLogSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    adminName: { type: String, required: true }, // denormalized so logs survive admin deletion
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'bulk_delete', 'login', 'logout', 'status_change', 'reply', 'import', 'export', 'backup'],
      required: true,
    },
    resource: { type: String, required: true }, // e.g. "Project", "Blog", "Settings"
    resourceId: { type: String, default: null },
    description: { type: String, required: true },
    ipAddress: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ resource: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
