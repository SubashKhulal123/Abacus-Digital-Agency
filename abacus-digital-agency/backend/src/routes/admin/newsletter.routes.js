const express = require('express');
const ctrl = require('../../controllers/admin/newsletter.controller');
const { csvUpload } = require('../../middlewares/upload.middleware');

const router = express.Router();

router.get('/export', ctrl.exportCSV);
router.post('/import', csvUpload.single('file'), ctrl.importCSV);
router.get('/', ctrl.list);
router.delete('/bulk', ctrl.bulkRemove);
router.delete('/:id', ctrl.remove);

module.exports = router;
