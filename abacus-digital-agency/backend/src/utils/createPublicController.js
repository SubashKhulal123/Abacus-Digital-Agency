const asyncHandler = require('./asyncHandler');
const ApiResponse = require('./ApiResponse');
const ApiError = require('./ApiError');
const ApiFeatures = require('./ApiFeatures');

/**
 * Factory that generates standard public (read-only) controller handlers
 * for a given Mongoose model. Every public-facing CMS resource (services,
 * projects, blogs, developers, testimonials, etc.) follows the exact same
 * shape — list with filters/pagination, or fetch one by slug/id — so this
 * factory removes the need to hand-write near-identical controllers 15
 * times over.
 *
 * @param {mongoose.Model} Model
 * @param {Object} options
 * @param {Object} [options.baseFilter] - always-applied filter, e.g. { isActive: true }
 * @param {string[]} [options.searchFields] - fields eligible for ?search=
 * @param {string} [options.defaultSort]
 * @param {Object[]} [options.populate] - array of populate configs
 * @param {string} [options.slugField] - field used to look up a single doc (default "slug")
 * @param {Function} [options.onSingleFetched] - async (doc, req) hook, e.g. increment views
 */
const createPublicController = (
  Model,
  {
    baseFilter = {},
    searchFields = [],
    defaultSort = '-createdAt',
    populate = [],
    slugField = 'slug',
    defaultLimit = 12,
    resourceName = 'Resource',
  } = {}
) => {
  const applyPopulate = (query) => {
    populate.forEach((p) => {
      query = query.populate(p);
    });
    return query;
  };

  const list = asyncHandler(async (req, res) => {
    let query = Model.find(baseFilter);
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
    const lookupValue = req.params.slug || req.params.id;
    const lookupField = req.params.slug ? slugField : '_id';

    let query = Model.findOne({ [lookupField]: lookupValue, ...baseFilter });
    query = applyPopulate(query);
    const doc = await query;

    if (!doc) {
      throw ApiError.notFound(`${resourceName} not found`);
    }

    return new ApiResponse(200, doc, `${resourceName} fetched`).send(res);
  });

  return { list, getOne };
};

module.exports = createPublicController;
