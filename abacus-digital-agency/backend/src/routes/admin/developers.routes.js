const express = require('express');
const Developer = require('../../models/Developer.model');
const createAdminController = require('../../utils/createAdminController');
const autoSlug = require('../../middlewares/autoSlug.middleware');
const { imageUpload } = require('../../middlewares/upload.middleware');
const { handleImageUpload } = require('../../middlewares/handleUpload.middleware');

const router = express.Router();
const ctrl = createAdminController(Developer, {
  resourceName: 'Developer',
  searchFields: ['name', 'designation', 'email'],
  populate: [{ path: 'technologies', select: 'name slug' }],
});

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', imageUpload.single('avatar'), autoSlug('name'), handleImageUpload('avatar', 'developers'), ctrl.create);
router.patch('/:id', imageUpload.single('avatar'), handleImageUpload('avatar', 'developers'), ctrl.update);
router.delete('/bulk', ctrl.bulkRemove);
router.delete('/:id', ctrl.remove);

module.exports = router;
