const express = require('express');
const { subscribe, unsubscribe } = require('../controllers/newsletter.controller');
const validate = require('../middlewares/validate.middleware');
const { sanitizePlainTextBody } = require('../middlewares/sanitize.middleware');
const { publicWriteLimiter } = require('../middlewares/rateLimiter.middleware');
const { newsletterSchema } = require('../validators/public.validator');

const router = express.Router();

router.post(
  '/subscribe',
  publicWriteLimiter,
  sanitizePlainTextBody,
  validate(newsletterSchema),
  subscribe
);
router.get('/unsubscribe/:token', unsubscribe);

module.exports = router;
