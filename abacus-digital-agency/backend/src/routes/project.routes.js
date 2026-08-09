const express = require('express');
const { listProjects, getProjectBySlug } = require('../controllers/project.controller');

const router = express.Router();

router.get('/', listProjects);
router.get('/:slug', getProjectBySlug);

module.exports = router;
