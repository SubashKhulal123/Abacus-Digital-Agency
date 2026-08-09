const express = require('express');
const ctrl = require('../../controllers/admin/contactMessages.controller');

const router = express.Router();

router.get('/export', ctrl.exportCSV);
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.patch('/:id/status', ctrl.updateStatus);
router.post('/:id/reply', ctrl.reply);
router.delete('/bulk', ctrl.bulkRemove);
router.delete('/:id', ctrl.remove);

module.exports = router;
