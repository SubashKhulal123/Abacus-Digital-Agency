const express = require('express');
const FAQ = require('../../models/FAQ.model');
const createAdminController = require('../../utils/createAdminController');

const router = express.Router();
const ctrl = createAdminController(FAQ, { resourceName: 'FAQ', searchFields: ['question', 'answer'] });

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', ctrl.create);
router.patch('/:id', ctrl.update);
router.delete('/bulk', ctrl.bulkRemove);
router.delete('/:id', ctrl.remove);

module.exports = router;
