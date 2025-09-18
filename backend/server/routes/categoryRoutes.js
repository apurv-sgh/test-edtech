const express = require('express');
const { getTopCategories, getAllCategories, getCategoryBySlug } = require('../controllers/categoryController');

const router = express.Router();

// GET /api/categories/top
router.get('/top', getTopCategories);

// GET /api/categories
router.get('/', getAllCategories);

// GET /api/categories/:slug
router.get('/:slug', getCategoryBySlug);

module.exports = router;


