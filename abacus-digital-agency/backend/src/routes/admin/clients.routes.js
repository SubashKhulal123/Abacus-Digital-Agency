const express = require('express');
const Client = require('../../models/Client.model');
const createAdminController = require('../../utils/createAdminController');
const { imageUpload } = require('../../middlewares/upload.middleware');
const { handleImageUpload } = require('../../middlewares/handleUpload.middleware');

const router = express.Router();
const ctrl = createAdminController(Client, { resourceName: 'Client', searchFields: ['name', 'industry'] });

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', imageUpload.single('logo'), handleImageUpload('logo', 'clients'), ctrl.create);
router.patch('/:id', imageUpload.single('logo'), handleImageUpload('logo', 'clients'), ctrl.update);
router.delete('/bulk', ctrl.bulkRemove);
router.delete('/:id', ctrl.remove);

module.exports = router;
