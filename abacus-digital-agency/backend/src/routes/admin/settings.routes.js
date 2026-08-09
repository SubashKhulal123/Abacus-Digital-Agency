const express = require('express');
const ctrl = require('../../controllers/admin/settings.controller');
const { imageUpload } = require('../../middlewares/upload.middleware');
const authorize = require('../../middlewares/role.middleware');
const { ADMIN_ROLES } = require('../../constants');

const router = express.Router();

router.get('/env-config', ctrl.getEnvConfig);
router.get('/', ctrl.getSettings);
router.patch('/', authorize(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN), ctrl.updateSettings);
router.post(
  '/upload/:field',
  authorize(ADMIN_ROLES.SUPER_ADMIN, ADMIN_ROLES.ADMIN),
  imageUpload.single('file'),
  ctrl.uploadBrandAsset
);

module.exports = router;
