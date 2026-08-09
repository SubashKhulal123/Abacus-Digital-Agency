const express = require('express');
const { listBlogs, getBlogBySlug, likeBlog } = require('../controllers/blog.controller');

const router = express.Router();

router.get('/', listBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/:id/like', likeBlog);

module.exports = router;
