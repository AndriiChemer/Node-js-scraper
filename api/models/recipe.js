const RecipeCategory = require("./recipeCategory")
const Category = require("./category")
const Subcategory = require("./subcategory")
const Ingredient = require("./ingredient")

module.exports = class Recipe {

    constructor(id, name, comment, image_url, create_at, portion_count, cook_time, is_active, ingredients){
        this.id = id
        this.name = name
        this.comment = comment
        this.image_url = image_url
        this.create_at = create_at
        this.portion_count = portion_count
        this.cook_time = cook_time
        this.is_active = is_active
        this.ingredients = ingredients
        // this.kitchen = kitchen
    }
    
    static getFromRow(row) {
        var id = row.id
        var name = row.name
        var comment = row.comment
        var image_url = row.image_url
        var create_at = row.create_at
        var portion_count = row.portion_count
        var cook_time = row.cook_time
        var is_active = row.is_active

        return new Recipe(id, name, comment, image_url, create_at, portion_count, cook_time, is_active, [])
    }

    addIngredients(row) {
        var ingredient = new Ingredient(row.ingredientId, row.ingredientName, row.ingredientValue, row.descriptionValue)
        
        console.log("Ingredient = " + JSON.stringify(ingredient))
        this.ingredients.push(ingredient)
    }

    addToList(model) {
        this.subcategoryList.push(model)
    }
};