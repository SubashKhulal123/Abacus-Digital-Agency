const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const Client = require('../models/Client.model');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const clients = await Client.find({ isActive: true }).sort('order name');
    return new ApiResponse(200, clients, 'Clients fetched').send(res);
  })
);

module.exports = router;
