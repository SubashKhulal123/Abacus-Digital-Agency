/**
 * Standardized success response shape returned by every endpoint:
 * {
 *   success: true,
 *   statusCode: 200,
 *   message: "...",
 *   data: {...},
 *   meta: {...}   // optional — pagination, counts, etc.
 * }
 */
class ApiResponse {
  constructor(statusCode, data = null, message = 'Success', meta = undefined) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }

  send(res) {
    return res.status(this.statusCode).json(this);
  }
}

module.exports = ApiResponse;
