const express = require('express');
const router = express.Router();

const RecipeController = require('../controllers/recipeController.js');

router.get('/getapks', (req, res, next) => {
    __dirname
    var filePath = __dirname + "/index.xml"; // Or format the path using the `id` rest param
    res.download(filePath)
});

//Work
router.post('/getby/category/subcategory', RecipeController.get_recipe_by_category_and_subcategory);
router.get('/getby/id/recipe', RecipeController.get_recipe_by_id);
router.post('/getby/id/tags', RecipeController.get_recipes_by_tag_id);
router.post('/getby/id/kitchen', RecipeController.get_recipes_by_kitchen_id);

//Ideas
router.get('/getby/ingredients', RecipeController.get_recipe_by_ingredients);
router.get('/getby/tasty', RecipeController.get_recipe_by_tasty);

module.exports = router;