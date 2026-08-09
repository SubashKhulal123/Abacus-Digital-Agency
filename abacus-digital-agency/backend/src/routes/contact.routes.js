const express = require('express');
const { submitContactMessage } = require('../controllers/contact.controller');
const validate = require('../middlewares/validate.middleware');
const { sanitizePlainTextBody } = require('../middlewares/sanitize.middleware');
const { publicWriteLimiter } = require('../middlewares/rateLimiter.middleware');
const { contactSchema } = require('../validators/public.validator');

const router = express.Router();

router.post(
  '/',
  publicWriteLimiter,
  sanitizePlainTextBody,
  validate(contactSchema),
  submitContactMessage
);

module.exports = router;
