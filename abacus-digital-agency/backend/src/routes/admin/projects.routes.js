const express = require('express');
const projectsController = require('../../controllers/admin/projects.controller');
const autoSlug = require('../../middlewares/autoSlug.middleware');
const { multiImageUpload } = require('../../middlewares/upload.middleware');

const router = express.Router();

const uploadFields = multiImageUpload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'gallery', maxCount: 10 },
]);

router.get('/', projectsController.list);
router.get('/:id', projectsController.getOne);
router.post('/', uploadFields, autoSlug('title'), projectsController.create);
router.patch('/:id', uploadFields, projectsController.update);
router.delete('/bulk', projectsController.bulkRemove);
router.delete('/:id', projectsController.remove);

module.exports = router;
