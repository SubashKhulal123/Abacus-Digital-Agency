const asyncHandler = require('./asyncHandler');
const ApiResponse = require('./ApiResponse');
const ApiError = require('./ApiError');
const ApiFeatures = require('./ApiFeatures');
const recordAuditLog = require('./auditLogger');

/**
 * Factory that generates a full set of admin (protected) CRUD handlers
 * for a given Mongoose model: list (with search/filter/pagination across
 * ALL records, not just published/active ones), getOne, create, update,
 * remove, and bulkRemove. Every mutation is automatically written to the
 * audit trail.
 *
 * Resources with extra logic (slug generation, image upload, populate,
 * status workflows) compose this factory's output with their own
 * middleware/overrides rather than duplicating the CRUD boilerplate.
 *
 * @param {mongoose.Model} Model
 * @param {Object} options
 * @param {string} options.resourceName - human-readable name for audit logs, e.g. "Developer"
 * @param {string[]} [options.searchFields]
 * @param {string} [options.defaultSort]
 * @param {Object[]} [options.populate]
 * @param {number} [options.defaultLimit]
 */
const createAdminController = (
  Model,
  {
    resourceName = 'Resource',
    searchFields = [],
    defaultSort = '-createdAt',
    populate = [],
    defaultLimit = 20,
  } = {}
) => {
  const applyPopulate = (query) => {
    populate.forEach((p) => {
      query = query.populate(p);
    });
    return query;
  };

  const list = asyncHandler(async (req, res) => {
    let query = Model.find({});
    query = applyPopulate(query);

    const features = new ApiFeatures(query, req.query)
      .filter()
      .search(searchFields)
      .sort(defaultSort)
      .limitFields();

    await features.paginate(defaultLimit);
    const results = await features.query;

    return new ApiResponse(200, results, `${resourceName} list fetched`, features.meta).send(res);
  });

  const getOne = asyncHandler(async (req, res) => {
    let query = Model.findById(req.params.id);
    query = applyPopulate(query);
    const doc = await query;

    if (!doc) throw ApiError.notFound(`${resourceName} not found`);

    return new ApiResponse(200, doc, `${resourceName} fetched`).send(res);
  });

  const create = asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);

    recordAuditLog({
      admin: req.admin,
      action: 'create',
      resource: resourceName,
      resourceId: doc._id,
      description: `Created ${resourceName.toLowerCase()} "${doc.title || doc.name || doc.email || doc._id}"`,
      ipAddress: req.ip,
    });

    return new ApiResponse(201, doc, `${resourceName} created successfully`).send(res);
  });

  const update = asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) throw ApiError.notFound(`${resourceName} not found`);

    recordAuditLog({
      admin: req.admin,
      action: 'update',
      resource: resourceName,
      resourceId: doc._id,
      description: `Updated ${resourceName.toLowerCase()} "${doc.title || doc.name || doc.email || doc._id}"`,
      ipAddress: req.ip,
    });

    return new ApiResponse(200, doc, `${resourceName} updated successfully`).send(res);
  });

  const remove = asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) throw ApiError.notFound(`${resourceName} not found`);

    recordAuditLog({
      admin: req.admin,
      action: 'delete',
      resource: resourceName,
      resourceId: doc._id,
      description: `Deleted ${resourceName.toLowerCase()} "${doc.title || doc.name || doc.email || doc._id}"`,
      ipAddress: req.ip,
    });

    return new ApiResponse(200, null, `${resourceName} deleted successfully`).send(res);
  });

  const bulkRemove = asyncHandler(async (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      throw ApiError.badRequest('Please provide an array of ids to delete');
    }

    const result = await Model.deleteMany({ _id: { $in: ids } });

    recordAuditLog({
      admin: req.admin,
      action: 'bulk_delete',
      resource: resourceName,
      description: `Bulk deleted ${result.deletedCount} ${resourceName.toLowerCase()}(s)`,
      ipAddress: req.ip,
      metadata: { ids },
    });

    return new ApiResponse(
      200,
      { deletedCount: result.deletedCount },
      `${result.deletedCount} ${resourceName.toLowerCase()}(s) deleted successfully`
    ).send(res);
  });

  return { list, getOne, create, update, remove, bulkRemove };
};

module.exports = createAdminController;
