const SELECT = require('../database/select')

const EMPTY_FIELD = 502

const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_ITEM_PER_PAGE = 10

exports.get_recipe_by_id = (req, res, next) => {
    var recipeId = req.body.recipeId

    console.log("Recipe id: " + recipeId)

    SELECT.getRecipeById(recipeId)
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

/// Recipes by kitchen id
exports.get_recipes_by_kitchen_id = (req, res, next) => {
    var kitchenId = req.body.kitchenId
    var numberPerPage = (req.body.numberPerPage === undefined) ? DEFAULT_ITEM_PER_PAGE : req.body.numberPerPage
    var currentPage = (req.body.currentPage === undefined) ? DEFAULT_PAGE_NUMBER : req.body.currentPage

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

/// Recipes by kitchen id
exports.get_recipes_by_tag_id = (req, res, next) => {
    var tagId = req.body.tagId
    var numberPerPage = (req.body.numberPerPage === undefined) ? DEFAULT_ITEM_PER_PAGE : req.body.numberPerPage
    var currentPage = (req.body.currentPage === undefined) ? DEFAULT_PAGE_NUMBER : req.body.currentPage

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

/// Recipes by category and subcategory ids
exports.get_recipe_by_category_and_subcategory = (req, res, next) => {

    var categoryId = req.body.categoryId
    var subcategoryId = req.body.subcategoryId
    var recipeCategoryId = req.body.recipeCategoryId
    var numberPerPage = (req.body.numberPerPage === undefined) ? DEFAULT_ITEM_PER_PAGE : req.body.numberPerPage
    var currentPage = (req.body.currentPage === undefined) ? DEFAULT_PAGE_NUMBER : req.body.currentPage

    var skip = (currentPage - 1) * numberPerPage
    var limitItems = skip + ',' + numberPerPage

    SELECT.getRecipesByCategoryId(categoryId, subcategoryId, recipeCategoryId, limitItems, numberPerPage, currentPage)
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

/// Recipes by ingredients list
exports.get_recipes_by_ingredients = (req, res, next) => {
    var ingredientsArray = req.body.ingredientsArray.toString().split(',')

    SELECT.getRecipesByIngredientNames(ingredientsArray)
    .then((jsonObject) => {
        res.status(200).json({
            statusCode: 200,
            status: 'Successfull',
            body: jsonObject
        });
    }).catch((error) => {
        handleError(error, res)
    })
}

/// Recipes by full ingredients list
exports.get_recipes_by_full_ingredient_list = (req, res, next) => {
    if(req.body.ingredientsArray === undefined) {
        var errorMessage = generateEmptyFieldMessage('ingredientsArray');
        sendError(EMPTY_FIELD, errorMessage, res)
    } else {
        var ingredientsArray = req.body.ingredientsArray.toString().split(',')
        var numberPerPage = (req.body.numberPerPage === undefined) ? DEFAULT_ITEM_PER_PAGE : req.body.numberPerPage
        var currentPage = (req.body.currentPage === undefined) ? DEFAULT_PAGE_NUMBER : req.body.currentPage
    
        var skip = (currentPage - 1) * numberPerPage
        var limitItems = skip + ',' + numberPerPage
    
        SELECT.getRecipesByFullIngredientNames(ingredientsArray, limitItems, numberPerPage, currentPage)
        .then((jsonObject) => {
            res.status(200).json({
                statusCode: 200,
                status: 'Successfull',
                body: jsonObject
            });
        }).catch((error) => {
            handleError(error, res)
        })
    } 
}

/// Recipes by full ingredients list
exports.get_recipes_by_part_ingredient_list = (req, res, next) => {
    if(req.body.ingredientsArray === undefined) {
        var errorMessage = generateEmptyFieldMessage('ingredientsArray');
        sendError(EMPTY_FIELD, errorMessage, res)
    } else {
        var ingredientsArray = req.body.ingredientsArray.toString().split(',')
        var numberPerPage = (req.body.numberPerPage === undefined) ? DEFAULT_ITEM_PER_PAGE : req.body.numberPerPage
        var currentPage = (req.body.currentPage === undefined) ? DEFAULT_PAGE_NUMBER : req.body.currentPage

        var skip = (currentPage - 1) * numberPerPage
        var limitItems = skip + ',' + numberPerPage

        SELECT.getRecipesByPartIngredientNames(ingredientsArray, limitItems, numberPerPage, currentPage)
        .then((jsonObject) => {
            res.status(200).json({
                statusCode: 200,
                status: 'Successfull',
                body: jsonObject
            });
        }).catch((error) => {
            handleError(error, res)
        })
    }
    
}

exports.get_recipe_by_tasty = (req, res, next) => {
    res.status(200).json({
        statusCode: 200,
        status: 'Successfull'
    });
}

function handleError(error, res) {
    if(error == -1){
        res.status(501).json({
            statusCode: 501,
            status: 'Error',
            errorBody: "Problem with server"
        });
    } else {
        console.log("Error: " + error);
        res.status(500).json({
            statusCode: 500,
            status: 'Error',
            errorBody: error
        });
    }
}

function sendError(errorCode, message, res) {
    res.status(501).json({
        statusCode: errorCode,
        status: 'Error',
        errorBody: message
    });
}

function generateEmptyFieldMessage(emptyField) {
    return `${emptyField} could not be null!`
}