const express = require('express');
const router = express.Router();

const RecipeController = require('../controllers/recipeController.js');

//Work
router.post('/getby/category/subcategory', RecipeController.get_recipe_by_category_and_subcategory);
router.get('/getby/id/recipe', RecipeController.get_recipe_by_id);
router.post('/getby/id/tags', RecipeController.get_recipes_by_tag_id);
router.post('/getby/id/kitchen', RecipeController.get_recipes_by_kitchen_id);
router.post('/getby/ingredients', RecipeController.get_recipes_by_ingredients);
router.post('/getby/part/ingredients', RecipeController.get_recipes_by_part_ingredient_list);
router.post('/getby/full/ingredients', RecipeController.get_recipes_by_full_ingredient_list);

// router.post('/update/recipe/id/', RecipeController.update_created_recipe_by_id);

//Ideas
router.get('/getby/tasty', RecipeController.get_recipe_by_tasty);

module.exports = router;