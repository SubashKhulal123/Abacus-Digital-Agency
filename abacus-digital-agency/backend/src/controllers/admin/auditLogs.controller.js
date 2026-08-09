const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const ApiFeatures = require('../../utils/ApiFeatures');
const AuditLog = require('../../models/AuditLog.model');

const list = asyncHandler(async (req, res) => {
  const query = AuditLog.find({});
  const features = new ApiFeatures(query, req.query)
    .filter()
    .search(['adminName', 'resource', 'description'])
    .sort('-createdAt')
    .limitFields();

  await features.paginate(30);
  const results = await features.query;

  return new ApiResponse(200, results, 'Audit logs fetched', features.meta).send(res);
});

module.exports = { list };
