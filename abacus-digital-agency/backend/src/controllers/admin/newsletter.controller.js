const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const ApiFeatures = require('../../utils/ApiFeatures');
const recordAuditLog = require('../../utils/auditLogger');
const { toCSV } = require('../../utils/csvExport');
const Newsletter = require('../../models/Newsletter.model');

const list = asyncHandler(async (req, res) => {
  const query = Newsletter.find({});
  const features = new ApiFeatures(query, req.query)
    .filter()
    .search(['email'])
    .sort('-createdAt')
    .limitFields();

  await features.paginate(20);
  const results = await features.query;

  return new ApiResponse(200, results, 'Subscribers fetched', features.meta).send(res);
});

const remove = asyncHandler(async (req, res) => {
  const doc = await Newsletter.findByIdAndDelete(req.params.id);
  if (!doc) throw ApiError.notFound('Subscriber not found');

  recordAuditLog({
    admin: req.admin,
    action: 'delete',
    resource: 'Newsletter',
    resourceId: doc._id,
    description: `Removed subscriber ${doc.email}`,
    ipAddress: req.ip,
  });

  return new ApiResponse(200, null, 'Subscriber removed successfully').send(res);
});

const bulkRemove = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) throw ApiError.badRequest('Please provide ids to delete');
  const result = await Newsletter.deleteMany({ _id: { $in: ids } });

  recordAuditLog({
    admin: req.admin,
    action: 'bulk_delete',
    resource: 'Newsletter',
    description: `Bulk removed ${result.deletedCount} subscriber(s)`,
    ipAddress: req.ip,
  });

  return new ApiResponse(200, { deletedCount: result.deletedCount }, 'Subscribers removed successfully').send(res);
});

const exportCSV = asyncHandler(async (req, res) => {
  const subscribers = await Newsletter.find({}).sort('-createdAt').lean();
  const csv = toCSV(subscribers, [
    { key: 'email', label: 'Email' },
    { key: 'isSubscribed', label: 'Subscribed' },
    { key: 'source', label: 'Source' },
    { key: 'createdAt', label: 'Joined At' },
  ]);

  recordAuditLog({
    admin: req.admin,
    action: 'export',
    resource: 'Newsletter',
    description: `Exported ${subscribers.length} subscriber(s) to CSV`,
    ipAddress: req.ip,
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="newsletter-subscribers.csv"');
  res.status(200).send(csv);
});

/**
 * @route POST /api/v1/admin/newsletter/import
 * @desc  Bulk-imports subscriber emails from an uploaded CSV file
 *        (expects a header row with an "email" column).
 */
const importCSV = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('Please upload a CSV file');

  const content = req.file.buffer.toString('utf-8');
  const lines = content.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) throw ApiError.badRequest('CSV file appears to be empty');

  const header = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const emailIndex = header.indexOf('email');
  if (emailIndex === -1) throw ApiError.badRequest('CSV must include an "email" column');

  const emailRegex = /^\S+@\S+\.\S+$/;
  const emails = lines
    .slice(1)
    .map((line) => line.split(',')[emailIndex]?.trim().toLowerCase())
    .filter((email) => email && emailRegex.test(email));

  const uniqueEmails = [...new Set(emails)];
  let imported = 0;
  let skipped = 0;

  for (const email of uniqueEmails) {
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      skipped += 1;
      continue;
    }
    await Newsletter.create({ email, source: 'csv-import' });
    imported += 1;
  }

  recordAuditLog({
    admin: req.admin,
    action: 'import',
    resource: 'Newsletter',
    description: `Imported ${imported} new subscriber(s) from CSV (${skipped} duplicates skipped)`,
    ipAddress: req.ip,
  });

  return new ApiResponse(200, { imported, skipped, total: uniqueEmails.length }, 'Import completed').send(res);
});

module.exports = { list, remove, bulkRemove, exportCSV, importCSV };
