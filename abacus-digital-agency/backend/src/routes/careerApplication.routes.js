const express = require('express');
const { submitApplication } = require('../controllers/careerApplication.controller');
const validate = require('../middlewares/validate.middleware');
const { sanitizePlainTextBody } = require('../middlewares/sanitize.middleware');
const { publicWriteLimiter } = require('../middlewares/rateLimiter.middleware');
const { documentUpload } = require('../middlewares/upload.middleware');
const { careerApplicationSchema } = require('../validators/public.validator');

const router = express.Router();

router.post(
  '/',
  publicWriteLimiter,
  documentUpload.single('resume'),
  sanitizePlainTextBody,
  validate(careerApplicationSchema),
  submitApplication
);

module.exports = router;
