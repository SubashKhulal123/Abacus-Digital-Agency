const express = require('express');
const JobPost = require('../models/JobPost.model');
const createPublicController = require('../utils/createPublicController');

const router = express.Router();

const { list, getOne } = createPublicController(JobPost, {
  baseFilter: { isActive: true },
  searchFields: ['title', 'department', 'location'],
  defaultSort: '-createdAt',
  defaultLimit: 24,
  resourceName: 'Job post',
});

router.get('/', list);
router.get('/:slug', getOne);

module.exports = router;
