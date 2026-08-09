const express = require('express');
const { getDashboard } = require('../../controllers/admin/dashboard.controller');

const router = express.Router();
router.get('/', getDashboard);

module.exports = router;
