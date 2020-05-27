const express = require('express');
const router = express.Router();

const CategoryController = require('../controllers/categoryController.js');

router.get('/get/categories/', CategoryController.get_list_category_and_subcategory);

module.exports = router;