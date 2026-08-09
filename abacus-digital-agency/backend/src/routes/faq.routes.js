const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const FAQ = require('../models/FAQ.model');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    const faqs = await FAQ.find(filter).sort('order createdAt');
    return new ApiResponse(200, faqs, 'FAQs fetched').send(res);
  })
);

module.exports = router;
