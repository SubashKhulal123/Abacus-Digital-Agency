const express = require('express');
const { createBackup } = require('../../controllers/admin/backup.controller');
const authorize = require('../../middlewares/role.middleware');
const { ADMIN_ROLES } = require('../../constants');

const router = express.Router();
router.get('/', authorize(ADMIN_ROLES.SUPER_ADMIN), createBackup);

module.exports = router;
