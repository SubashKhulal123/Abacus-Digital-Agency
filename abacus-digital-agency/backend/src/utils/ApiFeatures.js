/**
 * Reusable query builder for public list endpoints. Wraps a Mongoose
 * Query object and applies filtering/sorting/pagination from req.query,
 * so every resource controller gets consistent behavior for free:
 *
 *   GET /api/v1/projects?category=web-apps&sort=-createdAt&page=2&limit=9
 */
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const excluded = ['page', 'sort', 'limit', 'fields', 'search'];
    const queryObj = { ...this.queryString };
    excluded.forEach((field) => delete queryObj[field]);
    this.query = this.query.find(queryObj);
    return this;
  }

  search(fields = []) {
    if (this.queryString.search && fields.length) {
      const regex = new RegExp(this.queryString.search, 'i');
      this.query = this.query.find({ $or: fields.map((f) => ({ [f]: regex })) });
    }
    return this;
  }

  sort(defaultSort = '-createdAt') {
    const sortBy = this.queryString.sort
      ? this.queryString.sort.split(',').join(' ')
      : defaultSort;
    this.query = this.query.sort(sortBy);
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      this.query = this.query.select(this.queryString.fields.split(',').join(' '));
    }
    return this;
  }

  async paginate(defaultLimit = 12) {
    const page = Math.max(parseInt(this.queryString.page, 10) || 1, 1);
    const limit = Math.min(parseInt(this.queryString.limit, 10) || defaultLimit, 50);
    const skip = (page - 1) * limit;

    const countQuery = this.query.model.find(this.query.getFilter());
    const total = await countQuery.countDocuments();

    this.query = this.query.skip(skip).limit(limit);

    this.meta = {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    };
    return this;
  }
}

module.exports = ApiFeatures;
