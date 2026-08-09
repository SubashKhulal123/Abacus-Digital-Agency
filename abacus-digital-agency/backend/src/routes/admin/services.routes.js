const express = require('express');
const Service = require('../../models/Service.model');
const createAdminController = require('../../utils/createAdminController');
const autoSlug = require('../../middlewares/autoSlug.middleware');
const { imageUpload } = require('../../middlewares/upload.middleware');
const { handleImageUpload } = require('../../middlewares/handleUpload.middleware');

const router = express.Router();
const ctrl = createAdminController(Service, {
  resourceName: 'Service',
  searchFields: ['title', 'shortDescription'],
  populate: [{ path: 'technologies', select: 'name slug' }],
});

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', imageUpload.single('coverImage'), autoSlug('title'), handleImageUpload('coverImage', 'services'), ctrl.create);
router.patch('/:id', imageUpload.single('coverImage'), handleImageUpload('coverImage', 'services'), ctrl.update);
router.delete('/bulk', ctrl.bulkRemove);
router.delete('/:id', ctrl.remove);

module.exports = router;
