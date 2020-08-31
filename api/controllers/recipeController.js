const SELECT = require('../database/select')

exports.get_full_recipe_by_id = (req, res, next) => {
    var recipeId = req.body.recipeId

    console.log("Recipe id: " + recipeId)

    SELECT.getMultipleRecipe(recipeId)
    .then((jsonObject) => {
        res.status(200).json({
            statusCode: 200,
            status: 'Successfull',
            body: jsonObject
        });
    })
    .catch((error) => {
        handleError(error, res)
    })

}

exports.get_full_recipe_by_kitchen_id = (req, res, next) => {
    var kitchenId = req.body.kitchenId
    var numberPerPage = req.body.numberPerPage
    var currentPage = req.body.currentPage

    var skip = (currentPage - 1) * numberPerPage
    var limit = skip + ',' + numberPerPage

    console.log("Tag id: " + kitchenId)

    SELECT.getRecipeListByKitchenId(kitchenId, limit, numberPerPage, currentPage)
    .then((jsonObject) => {
        res.status(200).json({
            statusCode: 200,
            status: 'Successfull',
            body: jsonObject
        });
    })
    .catch((error) => {
        handleError(error, res)
    })

}

exports.get_full_recipe_by_tag_id = (req, res, next) => {
    var tagId = req.body.tagId
    var numberPerPage = req.body.numberPerPage
    var currentPage = req.body.currentPage

    var skip = (currentPage - 1) * numberPerPage
    var limit = skip + ',' + numberPerPage

    console.log("Tag id: " + tagId)

    SELECT.getRecipeListByTagId(tagId, limit, numberPerPage, currentPage)
    .then((jsonObject) => {
        res.status(200).json({
            statusCode: 200,
            status: 'Successfull',
            body: jsonObject
        });
    })
    .catch((error) => {
        handleError(error, res)
    })

}

exports.get_recipe_by_category_and_subcategory = (req, res, next) => {

    var categoryId = req.body.categoryId
    var subcategoryId = req.body.subcategoryId
    var recipeCategoryId = req.body.recipeCategoryId

    console.log("categoryId: " + categoryId + "\tsubcategoryId: " + subcategoryId + "\trecipeCategoryId: " + recipeCategoryId)

    SELECT.getRecipesByCategoryId(categoryId, subcategoryId, recipeCategoryId)
    .then((jsonObject) => {
        res.status(200).json({
            statusCode: 200,
            status: 'Successfull',
            body: jsonObject
        });
    })
    .catch((error) => {
        handleError(error, res)
    })
}

exports.get_ingredients_by_recipe_id = (req, res, next) => {
    var recipeId = req.body.recipeId

    SELECT.getIngredientsByRecipeId(recipeId)
    .then((jsonObject) => {
        res.status(200).json({
            statusCode: 200,
            status: 'Successfull',
            body: jsonObject
        });
    })
    .catch((error) => {
        handleError(error, res)
    })
}

exports.get_energy_by_recipe_id = (req, res, next) => {
    var recipeId = req.body.recipeId

    SELECT.getEnergyTableByRecipeId(recipeId)
    .then((jsonObject) => {
        res.status(200).json({
            statusCode: 200,
            status: 'Successfull',
            body: jsonObject
        });
    })
    .catch((error) => {
        handleError(error, res)
    })
}

exports.get_cook_steps_by_recipe_id = (req, res, next) => {
    var recipeId = req.body.recipeId

    SELECT.getCookStepsByRecipeId(recipeId)
    .then((jsonObject) => {
        res.status(200).json({
            statusCode: 200,
            status: 'Successfull',
            body: jsonObject
        });
    })
    .catch((error) => {
        handleError(error, res)
    })
}

exports.get_tags_by_recipe_id = (req, res, next) => {
    var recipeId = req.body.recipeId

    SELECT.getTagsByRecipeId(recipeId)
    .then((jsonObject) => {
        res.status(200).json({
            statusCode: 200,
            status: 'Successfull',
            body: jsonObject
        });
    })
    .catch((error) => {
        handleError(error, res)
    })
}

exports.get_tastes_by_recipe_id = (req, res, next) => {
    var recipeId = req.body.recipeId

    SELECT.getTastesByRecipeId(recipeId)
    .then((jsonObject) => {
        res.status(200).json({
            statusCode: 200,
            status: 'Successfull',
            body: jsonObject
        });
    })
    .catch((error) => {
        handleError(error, res)
    })
}


function handleError(error, res) {
    if(error == -1){
        res.status(501).json({
            statusCode: 501,
            status: 'Error',
            errorBody: "Problem with server"
        });
    } else {
        res.status(500).json({
            statusCode: 500,
            status: 'Error',
            errorBody: error
        });
    }
}

// TODO 
exports.get_recipe_by_ingredients = (req, res, next) => {
    res.status(200).json({
        statusCode: 200,
        status: 'Successfull'
    });
}

exports.get_recipe_by_kitchen = (req, res, next) => {
    res.status(200).json({
        statusCode: 200,
        status: 'Successfull'
    });
}

exports.get_recipe_by_tag = (req, res, next) => {
    res.status(200).json({
        statusCode: 200,
        status: 'Successfull'
    });
}

exports.get_recipe_by_tasty = (req, res, next) => {
    res.status(200).json({
        statusCode: 200,
        status: 'Successfull'
    });
}

exports.get_recipe_by_appointment = (req, res, next) => {
    res.status(200).json({
        statusCode: 200,
        status: 'Successfull'
    });
}