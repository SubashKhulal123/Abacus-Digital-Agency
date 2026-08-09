const express = require('express');
const blogsController = require('../../controllers/admin/blogs.controller');
const autoSlug = require('../../middlewares/autoSlug.middleware');
const { imageUpload } = require('../../middlewares/upload.middleware');

const router = express.Router();

router.get('/', blogsController.list);
router.get('/:id', blogsController.getOne);
router.post('/', imageUpload.single('coverImage'), autoSlug('title'), blogsController.create);
router.patch('/:id', imageUpload.single('coverImage'), blogsController.update);
router.delete('/bulk', blogsController.bulkRemove);
router.delete('/:id', blogsController.remove);

module.exports = router;
