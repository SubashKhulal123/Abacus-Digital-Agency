const express = require('express');
const ctrl = require('../../controllers/admin/media.controller');
const { imageUpload } = require('../../middlewares/upload.middleware');

const router = express.Router();

router.get('/', ctrl.list);
router.post('/', imageUpload.single('file'), ctrl.upload);
router.delete('/bulk', ctrl.bulkRemove);
router.delete('/:id', ctrl.remove);

module.exports = router;
