const express = require('express');
const Service = require('../models/Service.model');
const createPublicController = require('../utils/createPublicController');

const router = express.Router();

const { list, getOne } = createPublicController(Service, {
  baseFilter: { isActive: true },
  searchFields: ['title', 'shortDescription'],
  defaultSort: 'order -createdAt',
  populate: [{ path: 'technologies', select: 'name slug icon color' }],
  defaultLimit: 24,
  resourceName: 'Service',
});

router.get('/', list);
router.get('/:slug', getOne);

module.exports = router;
