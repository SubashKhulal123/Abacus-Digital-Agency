const express = require('express');
const JobPost = require('../../models/JobPost.model');
const createAdminController = require('../../utils/createAdminController');
const autoSlug = require('../../middlewares/autoSlug.middleware');

const router = express.Router();
const ctrl = createAdminController(JobPost, {
  resourceName: 'Job Post',
  searchFields: ['title', 'department', 'location'],
});

// Attach the authenticated admin as postedBy before create
const attachPostedBy = (req, res, next) => {
  req.body.postedBy = req.admin._id;
  next();
};

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', autoSlug('title'), attachPostedBy, ctrl.create);
router.patch('/:id', ctrl.update);
router.delete('/bulk', ctrl.bulkRemove);
router.delete('/:id', ctrl.remove);

module.exports = router;
