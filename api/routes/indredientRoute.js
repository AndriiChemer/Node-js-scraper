const express = require('express');
const router = express.Router();

const IngredientController = require('../controllers/ingredientController.js');

router.post('/getby/name/ingredients', IngredientController.get_recipe_by_category_and_subcategory);

module.exports = router;