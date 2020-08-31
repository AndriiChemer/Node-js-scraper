const express = require('express');
const router = express.Router();

const CategoryController = require('../controllers/categoryController.js');

router.get('/get/categories/', CategoryController.get_list_category_and_subcategory);
router.get('/get/get_categories_kitchens_tastes/', CategoryController.get_categories_kitchens_tastes);

module.exports = router;