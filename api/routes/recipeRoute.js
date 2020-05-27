const express = require('express');
const router = express.Router();

const RecipeController = require('../controllers/recipeController.js');

//Work
router.get('/getby/category/subcategory', RecipeController.get_recipe_by_category_and_subcategory);
router.get('/getby/category/subcategory/recipewithingredients', RecipeController.get_recipe_with_ingredients_by_category_and_subcategory);
router.get('/getby/recipeid/ingredients', RecipeController.get_ingredients_by_recipe_id);
router.get('/getby/id/fullrecipe', RecipeController.get_full_recipe_by_id);
router.get('/getby/id/recipe/cooksteps', RecipeController.get_cook_steps_by_recipe_id);


//Check it

//Ideas
router.get('/getby/ingredients', RecipeController.get_recipe_by_ingredients);
router.get('/getby/kitchen', RecipeController.get_recipe_by_kitchen);
router.get('/getby/tag', RecipeController.get_recipe_by_tag);
router.get('/getby/tasty', RecipeController.get_recipe_by_tasty);
router.get('/getby/appointment', RecipeController.get_recipe_by_appointment);

module.exports = router;