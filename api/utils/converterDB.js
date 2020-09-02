const Kitchen = require("../models/kitchen") 
const Category = require('../models/category')
const Subcategory = require('../models/subcategory')
const RecipeCategory = require('../models/recipeCategory')
const Recipe = require("../models/recipe")
const Ingredient = require("../models/ingredient")
const Energy = require("../models/energy") 
const CookStep = require("../models/cookstep") 
const Tag = require("../models/tag") 
const Tasty = require("../models/tasty") 

module.exports.convertKitchenList = (resultList) => {

    kitchenList = []

    try {
        resultList.forEach(row => {
            var model = Kitchen.getFromRow(row)
            kitchenList.push(model)
        });
    } catch (error) {
        console.log("convertKitchen error: " + error)
    }

    return kitchenList

}

module.exports.convertCategoryList = (rows, subcategoryList) => {
    var listCategory = []

    rows.forEach(row => {
        model = Category.getFromRow(row)

        subcategoryList.forEach(subcategory => {
            if(model.id == subcategory.categoryId) {
                model.addToList(subcategory)
            }
        });

        listCategory.push(model)
    });

    return listCategory
}

module.exports.convertSubategoryList = (rows, recipeCategoryList) => {
    var listSubcategory = []
    rows.forEach(row => {
        model = Subcategory.getFromRow(row)

        recipeCategoryList.forEach(recipeCategory => {
            if(recipeCategory.subcategoryId == model.id) {
                model.addToList(recipeCategory)
            }
        });
        listSubcategory.push(model)
    });

    return listSubcategory
}

module.exports.convertRecipeCategoryList = (rows) => {
    var listRecipeCategory = []
    rows.forEach(row => {
        model = RecipeCategory.getFromRow(row)
        listRecipeCategory.push(model)
    });

    return listRecipeCategory
}

module.exports.convertRecipeList = (resultList) => {
    recipeList = []
    
    resultList.forEach(row => {
        var model = Recipe.getFromRow(row)
        recipeList.push(model)
    });

    return recipeList
}

module.exports.convertIngredientsList = (resultList) => {
    ingredientsList = []

    try {
        resultList.forEach(row => {
            var model = Ingredient.getFromRow(row)
            ingredientsList.push(model)
        });
    } catch (error) {
        console.log("convertIngredientsList error: " + error)
    }
    
    return ingredientsList
}

module.exports.convertEnergyList = (resultList) => {
    energyList = []
    
    try {
        resultList.forEach(row => {
            var model = Energy.getFromRow(row)
            energyList.push(model)
        });
    } catch (error) {
        console.log("convertEnergyList error: " + error)
    }

    return energyList
}

module.exports.convertCookStepList = (resultList) => {
    cookSteps = []

    try {
        resultList.forEach(row => {
            var model = CookStep.getFromRow(row)
            cookSteps.push(model)
        });
    } catch (error) {
        console.log("convertCookSteps error: " + error)
    }
    
    return cookSteps
}

module.exports.convertTagsList = (resultList) => {
    tagsList = []
    
    try {
        resultList.forEach(row => {
            var model = Tag.getFromRow(row)
            tagsList.push(model)
        });
    } catch (error) {
        console.log("convertTagsList error: " + error)
    }

    return tagsList
}

module.exports.convertTastesList = (resultList) => {
    tastesList = []

    try {
        resultList.forEach(row => {
            var model = Tasty.getFromRow(row)
            tastesList.push(model)
        });
    } catch (error) {
        console.log("convertTastesList error: " + error)
    }

    return tastesList
}