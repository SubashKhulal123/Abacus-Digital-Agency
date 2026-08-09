const fs = require('fs');
const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const logger = require('../../utils/logger');

/**
 * @route GET /api/v1/admin/logs?lines=200&level=error
 * @desc  Tails the application's local log file. Simple and dependency-free
 *        — sufficient for small-to-medium deployments; larger deployments
 *        should ship logs to an external aggregator (Datadog, CloudWatch,
 *        etc.) instead, which is a config change, not a code change.
 */
const getLogs = asyncHandler(async (req, res) => {
  const requestedLines = Math.min(parseInt(req.query.lines, 10) || 200, 1000);
  const levelFilter = req.query.level ? req.query.level.toUpperCase() : null;

  if (!fs.existsSync(logger.LOG_FILE_PATH)) {
    return new ApiResponse(200, { lines: [], totalAvailable: 0 }, 'No logs recorded yet').send(res);
  }

  const content = fs.readFileSync(logger.LOG_FILE_PATH, 'utf-8');
  let allLines = content.split('\n').filter(Boolean);

  if (levelFilter) {
    allLines = allLines.filter((line) => line.includes(`[${levelFilter}]`));
  }

  const lines = allLines.slice(-requestedLines).reverse();

  return new ApiResponse(200, { lines, totalAvailable: allLines.length }, 'Logs fetched').send(res);
});

module.exports = { getLogs };
