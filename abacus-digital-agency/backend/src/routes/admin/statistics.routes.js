const express = require('express');
const Statistic = require('../../models/Statistic.model');
const createAdminController = require('../../utils/createAdminController');

const router = express.Router();
const ctrl = createAdminController(Statistic, { resourceName: 'Statistic', searchFields: ['label'] });

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', ctrl.create);
router.patch('/:id', ctrl.update);
router.delete('/bulk', ctrl.bulkRemove);
router.delete('/:id', ctrl.remove);

module.exports = router;
