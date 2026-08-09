const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const ApiFeatures = require('../../utils/ApiFeatures');
const recordAuditLog = require('../../utils/auditLogger');
const { toCSV } = require('../../utils/csvExport');
const sendEmail = require('../../utils/sendEmail');
const emailTemplates = require('../../utils/emailTemplates');
const ContactMessage = require('../../models/ContactMessage.model');

const list = asyncHandler(async (req, res) => {
  const query = ContactMessage.find({});
  const features = new ApiFeatures(query, req.query)
    .filter()
    .search(['name', 'email', 'subject', 'message'])
    .sort('-createdAt')
    .limitFields();

  await features.paginate(20);
  const results = await features.query;

  return new ApiResponse(200, results, 'Contact messages fetched', features.meta).send(res);
});

const getOne = asyncHandler(async (req, res) => {
  const doc = await ContactMessage.findById(req.params.id);
  if (!doc) throw ApiError.notFound('Message not found');

  if (doc.status === 'unread') {
    doc.status = 'read';
    await doc.save();
  }

  return new ApiResponse(200, doc, 'Message fetched').send(res);
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const doc = await ContactMessage.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!doc) throw ApiError.notFound('Message not found');

  recordAuditLog({
    admin: req.admin,
    action: 'status_change',
    resource: 'ContactMessage',
    resourceId: doc._id,
    description: `Marked message from ${doc.name} as ${status}`,
    ipAddress: req.ip,
  });

  return new ApiResponse(200, doc, 'Message status updated').send(res);
});

/**
 * @route POST /api/v1/admin/contact/:id/reply
 * @desc  Sends a real email reply to the message sender and records it
 */
const reply = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message || message.trim().length < 2) {
    throw ApiError.badRequest('Reply message cannot be empty');
  }

  const doc = await ContactMessage.findById(req.params.id);
  if (!doc) throw ApiError.notFound('Message not found');

  const { subject: replySubject, html: replyHtml } = emailTemplates.contactReply({
    name: doc.name,
    subject: doc.subject,
    message,
  });
  await sendEmail({ to: doc.email, subject: replySubject, html: replyHtml });

  doc.status = 'replied';
  doc.respondedAt = new Date();
  doc.adminNotes = `${doc.adminNotes ? doc.adminNotes + '\n\n' : ''}[Reply sent ${new Date().toISOString()}]: ${message}`;
  await doc.save();

  recordAuditLog({
    admin: req.admin,
    action: 'reply',
    resource: 'ContactMessage',
    resourceId: doc._id,
    description: `Replied to message from ${doc.name} (${doc.email})`,
    ipAddress: req.ip,
  });

  return new ApiResponse(200, doc, 'Reply sent successfully').send(res);
});

const remove = asyncHandler(async (req, res) => {
  const doc = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!doc) throw ApiError.notFound('Message not found');

  recordAuditLog({
    admin: req.admin,
    action: 'delete',
    resource: 'ContactMessage',
    resourceId: doc._id,
    description: `Deleted message from ${doc.name}`,
    ipAddress: req.ip,
  });

  return new ApiResponse(200, null, 'Message deleted successfully').send(res);
});

const bulkRemove = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) throw ApiError.badRequest('Please provide ids to delete');
  const result = await ContactMessage.deleteMany({ _id: { $in: ids } });

  recordAuditLog({
    admin: req.admin,
    action: 'bulk_delete',
    resource: 'ContactMessage',
    description: `Bulk deleted ${result.deletedCount} message(s)`,
    ipAddress: req.ip,
  });

  return new ApiResponse(200, { deletedCount: result.deletedCount }, 'Messages deleted successfully').send(res);
});

const exportCSV = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find({}).sort('-createdAt').lean();
  const csv = toCSV(messages, [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'company', label: 'Company' },
    { key: 'subject', label: 'Subject' },
    { key: 'message', label: 'Message' },
    { key: 'budgetRange', label: 'Budget' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Received At' },
  ]);

  recordAuditLog({
    admin: req.admin,
    action: 'export',
    resource: 'ContactMessage',
    description: `Exported ${messages.length} contact message(s) to CSV`,
    ipAddress: req.ip,
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="contact-messages.csv"');
  res.status(200).send(csv);
});

module.exports = { list, getOne, updateStatus, reply, remove, bulkRemove, exportCSV };
