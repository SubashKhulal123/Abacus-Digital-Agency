const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const Statistic = require('../models/Statistic.model');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const stats = await Statistic.find({ isActive: true }).sort('order');
    return new ApiResponse(200, stats, 'Statistics fetched').send(res);
  })
);

module.exports = router;
