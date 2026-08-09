const app = require('./src/app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');
const logger = require('./src/utils/logger');

let server;

const start = async () => {
  await connectDB();

  server = app.listen(env.PORT, () => {
    logger.info(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });
};

start();

// ---------------------------------------------------------------------------
// Global safety nets — log and gracefully shut down on fatal errors instead
// of leaving the process in a corrupted state.
// ---------------------------------------------------------------------------
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Promise Rejection: ${reason?.message || reason}`);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  process.exit(1);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received — shutting down gracefully');
  if (server) server.close(() => process.exit(0));
});
