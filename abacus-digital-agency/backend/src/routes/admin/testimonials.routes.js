const express = require('express');
const Testimonial = require('../../models/Testimonial.model');
const createAdminController = require('../../utils/createAdminController');
const { imageUpload } = require('../../middlewares/upload.middleware');
const { handleImageUpload } = require('../../middlewares/handleUpload.middleware');

const router = express.Router();
const ctrl = createAdminController(Testimonial, {
  resourceName: 'Testimonial',
  searchFields: ['clientName', 'clientCompany', 'message'],
  populate: [{ path: 'project', select: 'title slug' }],
});

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', imageUpload.single('clientAvatar'), handleImageUpload('clientAvatar', 'testimonials'), ctrl.create);
router.patch('/:id', imageUpload.single('clientAvatar'), handleImageUpload('clientAvatar', 'testimonials'), ctrl.update);
router.delete('/bulk', ctrl.bulkRemove);
router.delete('/:id', ctrl.remove);

module.exports = router;
