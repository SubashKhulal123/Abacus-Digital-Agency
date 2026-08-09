const express = require('express');
const ctrl = require('../../controllers/admin/notifications.controller');

const router = express.Router();

router.get('/', ctrl.list);
router.patch('/read-all', ctrl.markAllRead);
router.patch('/:id/read', ctrl.markRead);

module.exports = router;
