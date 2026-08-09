const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const Category = require('../models/Category.model');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = { isActive: true };
    if (req.query.type) filter.type = req.query.type;
    const categories = await Category.find(filter).sort('order name');
    return new ApiResponse(200, categories, 'Categories fetched').send(res);
  })
);

module.exports = router;
