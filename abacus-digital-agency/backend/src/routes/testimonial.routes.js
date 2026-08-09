const express = require('express');
const Testimonial = require('../models/Testimonial.model');
const createPublicController = require('../utils/createPublicController');

const router = express.Router();

const { list } = createPublicController(Testimonial, {
  baseFilter: { isActive: true },
  defaultSort: 'order -createdAt',
  populate: [{ path: 'project', select: 'title slug' }],
  defaultLimit: 24,
  resourceName: 'Testimonial',
});

router.get('/', list);

module.exports = router;
