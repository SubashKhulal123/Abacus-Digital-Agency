const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const { sanitizeQueryAndParams } = require('./middlewares/sanitize.middleware');

const env = require('./config/env');
const logger = require('./utils/logger');
const routes = require('./routes');
const { getSitemap, getRobotsTxt } = require('./controllers/sitemap.controller');
const notFound = require('./middlewares/notFound.middleware');
const errorHandler = require('./middlewares/errorHandler.middleware');
const { globalLimiter } = require('./middlewares/rateLimiter.middleware');

const app = express();

// Trust the first proxy hop (required for correct req.ip behind Render/Heroku/Nginx)
app.set('trust proxy', 1);

// ---------------------------------------------------------------------------
// Security middleware
// ---------------------------------------------------------------------------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow Cloudinary-hosted images to load
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com', 'https://picsum.photos', 'https://images.unsplash.com'],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
      },
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);
app.use(mongoSanitize()); // strips $ and . operators from req.body/query/params (NoSQL injection)
app.use(hpp()); // protects against HTTP parameter pollution

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
);

app.use('/api', globalLimiter);

// ---------------------------------------------------------------------------
// Core middleware
// ---------------------------------------------------------------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(env.COOKIE_SECRET));
app.use(compression());
app.use(sanitizeQueryAndParams); // strips HTML from URL query params/route params only

if (env.IS_DEV) {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Abacus Digital Agency API is running',
    docs: '/api/v1/health',
  });
});

app.use('/api/v1', routes);

// SEO conventions expect these at the domain root, not under /api
app.get('/sitemap.xml', getSitemap);
app.get('/robots.txt', getRobotsTxt);

// ---------------------------------------------------------------------------
// Error handling (must be last)
// ---------------------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
