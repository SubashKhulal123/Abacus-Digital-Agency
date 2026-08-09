const express = require('express');
const { getLogs } = require('../../controllers/admin/logs.controller');

const router = express.Router();
router.get('/', getLogs);

module.exports = router;
