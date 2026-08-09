/**
 * Minimal structured logger.
 * Kept dependency-free (no winston/pino) to keep Phase 1 lean, but the
 * interface (info/warn/error/debug) is stable so it can be swapped for a
 * full logging library later without touching call sites.
 *
 * Also appends every entry to a local log file so the admin "Logs" screen
 * has something real to display without needing an external log service.
 */
const fs = require('fs');
const path = require('path');
const env = require('../config/env');

const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');
const MAX_LOG_SIZE_BYTES = 5 * 1024 * 1024; // rotate at 5MB

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function rotateIfNeeded() {
  try {
    if (fs.existsSync(LOG_FILE) && fs.statSync(LOG_FILE).size > MAX_LOG_SIZE_BYTES) {
      fs.renameSync(LOG_FILE, `${LOG_FILE}.${Date.now()}.old`);
    }
  } catch (_) {
    // best-effort — never let log rotation crash the app
  }
}

function appendToFile(level, message) {
  try {
    rotateIfNeeded();
    fs.appendFileSync(LOG_FILE, `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}\n`);
  } catch (_) {
    // best-effort — logging failures should never crash the app
  }
}

const COLORS = {
  info: '\x1b[36m', // cyan
  warn: '\x1b[33m', // yellow
  error: '\x1b[31m', // red
  debug: '\x1b[90m', // gray
  reset: '\x1b[0m',
};

function timestamp() {
  return new Date().toISOString();
}

function log(level, message) {
  const color = COLORS[level] || '';
  // eslint-disable-next-line no-console
  console[level === 'debug' ? 'log' : level](
    `${color}[${timestamp()}] [${level.toUpperCase()}]${COLORS.reset} ${message}`
  );
  appendToFile(level, message);
}

const logger = {
  info: (msg) => log('info', msg),
  warn: (msg) => log('warn', msg),
  error: (msg) => log('error', msg),
  debug: (msg) => {
    if (env.IS_DEV) log('debug', msg);
  },
  LOG_FILE_PATH: LOG_FILE,
};

module.exports = logger;
