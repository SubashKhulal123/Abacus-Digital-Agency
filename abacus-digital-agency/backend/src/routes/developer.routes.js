const express = require('express');
const Developer = require('../models/Developer.model');
const createPublicController = require('../utils/createPublicController');

const router = express.Router();

const { list, getOne } = createPublicController(Developer, {
  baseFilter: { isActive: true },
  searchFields: ['name', 'designation', 'skills'],
  defaultSort: 'order -createdAt',
  defaultLimit: 24,
  resourceName: 'Developer',
});

router.get('/', list);
router.get('/:slug', getOne);

module.exports = router;
