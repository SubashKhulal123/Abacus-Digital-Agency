const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiError = require('../../utils/ApiError');
const ApiFeatures = require('../../utils/ApiFeatures');
const recordAuditLog = require('../../utils/auditLogger');
const { toCSV } = require('../../utils/csvExport');
const sendEmail = require('../../utils/sendEmail');
const emailTemplates = require('../../utils/emailTemplates');
const CareerApplication = require('../../models/CareerApplication.model');

const POPULATE = [{ path: 'jobPost', select: 'title department location' }];

const list = asyncHandler(async (req, res) => {
  let query = CareerApplication.find({});
  POPULATE.forEach((p) => { query = query.populate(p); });

  const features = new ApiFeatures(query, req.query)
    .filter()
    .search(['name', 'email'])
    .sort('-createdAt')
    .limitFields();

  await features.paginate(20);
  const results = await features.query;

  return new ApiResponse(200, results, 'Applications fetched', features.meta).send(res);
});

const getOne = asyncHandler(async (req, res) => {
  let query = CareerApplication.findById(req.params.id);
  POPULATE.forEach((p) => { query = query.populate(p); });
  const doc = await query;
  if (!doc) throw ApiError.notFound('Application not found');
  return new ApiResponse(200, doc, 'Application fetched').send(res);
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status, notifyApplicant } = req.body;

  const doc = await CareerApplication.findByIdAndUpdate(
    req.params.id,
    { status, reviewedBy: req.admin._id, reviewedAt: new Date() },
    { new: true }
  );
  if (!doc) throw ApiError.notFound('Application not found');

  if (notifyApplicant && ['shortlisted', 'rejected', 'hired'].includes(status)) {
    const { subject, html } = emailTemplates.applicationStatusUpdate({ name: doc.name, status });
    sendEmail({ to: doc.email, subject, html }).catch(() => {});
  }

  recordAuditLog({
    admin: req.admin,
    action: 'status_change',
    resource: 'CareerApplication',
    resourceId: doc._id,
    description: `Marked application from ${doc.name} as ${status}`,
    ipAddress: req.ip,
  });

  return new ApiResponse(200, doc, 'Application status updated').send(res);
});

const remove = asyncHandler(async (req, res) => {
  const doc = await CareerApplication.findByIdAndDelete(req.params.id);
  if (!doc) throw ApiError.notFound('Application not found');

  recordAuditLog({
    admin: req.admin,
    action: 'delete',
    resource: 'CareerApplication',
    resourceId: doc._id,
    description: `Deleted application from ${doc.name}`,
    ipAddress: req.ip,
  });

  return new ApiResponse(200, null, 'Application deleted successfully').send(res);
});

const bulkRemove = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) throw ApiError.badRequest('Please provide ids to delete');
  const result = await CareerApplication.deleteMany({ _id: { $in: ids } });

  recordAuditLog({
    admin: req.admin,
    action: 'bulk_delete',
    resource: 'CareerApplication',
    description: `Bulk deleted ${result.deletedCount} application(s)`,
    ipAddress: req.ip,
  });

  return new ApiResponse(200, { deletedCount: result.deletedCount }, 'Applications deleted successfully').send(res);
});

const exportCSV = asyncHandler(async (req, res) => {
  const applications = await CareerApplication.find({}).populate('jobPost', 'title').sort('-createdAt').lean();
  const csv = toCSV(
    applications.map((a) => ({ ...a, jobTitle: a.jobPost?.title || '' })),
    [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'jobTitle', label: 'Job' },
      { key: 'experienceYears', label: 'Experience (yrs)' },
      { key: 'status', label: 'Status' },
      { key: 'createdAt', label: 'Applied At' },
    ]
  );

  recordAuditLog({
    admin: req.admin,
    action: 'export',
    resource: 'CareerApplication',
    description: `Exported ${applications.length} application(s) to CSV`,
    ipAddress: req.ip,
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="career-applications.csv"');
  res.status(200).send(csv);
});

module.exports = { list, getOne, updateStatus, remove, bulkRemove, exportCSV };
