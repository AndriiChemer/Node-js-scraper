const express = require('express');
const router = express.Router();

const RecipeController = require('../controllers/recipeController.js');

router.get('/getby/category/subcategory', RecipeController.get_recipe_by_category_and_subcategory);
router.get('/getby/ingredients', RecipeController.get_recipe_by_ingredients);
router.get('/getby/kitchen', RecipeController.get_recipe_by_kitchen);
router.get('/getby/tag', RecipeController.get_recipe_by_tag);
router.get('/getby/tasty', RecipeController.get_recipe_by_tasty);
router.get('/getby/appointment', RecipeController.get_recipe_by_appointment);

router.get('/test', RecipeController.test);

module.exports = router;