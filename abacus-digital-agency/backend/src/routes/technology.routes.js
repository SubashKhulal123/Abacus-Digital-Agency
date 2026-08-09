const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const Technology = require('../models/Technology.model');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    const technologies = await Technology.find(filter).sort('order name');
    return new ApiResponse(200, technologies, 'Technologies fetched').send(res);
  })
);

module.exports = router;
