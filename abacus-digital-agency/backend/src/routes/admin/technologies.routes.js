const express = require('express');
const Technology = require('../../models/Technology.model');
const createAdminController = require('../../utils/createAdminController');
const autoSlug = require('../../middlewares/autoSlug.middleware');

const router = express.Router();
const ctrl = createAdminController(Technology, { resourceName: 'Technology', searchFields: ['name'] });

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', autoSlug('name'), ctrl.create);
router.patch('/:id', ctrl.update);
router.delete('/bulk', ctrl.bulkRemove);
router.delete('/:id', ctrl.remove);

module.exports = router;
