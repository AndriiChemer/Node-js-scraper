const database = require('./connection');
var async = require('async');
const converterDB = require('../utils/converterDB')

function generalSelect(column, params) {
    return 'SELECT ' + params + ' FROM ' + column ;
}

// Get list of json category with subcategory and subSubCategory
exports.selectCategory = () => {
    
    const selectCategory = generalSelect('category', 'id, name');
    const selectSubcategory = generalSelect('subcategory', 'id, name, id_category');
    const selectRecipeCategory = generalSelect('recipe_category', 'id, name, id_subcategory');

    return new Promise((resolve, reject) => {
        database.query(selectCategory, (errCategory, resultCategory) => {
            if(errCategory) {
                reject(errCategory)
            }
    
            database.query(selectSubcategory, (errSubcategory, resultSubcategory) => {
                if(errSubcategory) {
                    reject(errSubcategory)
                }
    
                database.query(selectRecipeCategory, (errRecipeCategory, resultRecipeCategory) => {
                    if(errRecipeCategory) {
                        reject(errRecipeCategory)
                    }
    
                    try {
                        recipeCategoryList = converterDB.convertRecipeCategoryList(resultRecipeCategory)
                        subcategoryList = converterDB.convertSubategoryList(resultSubcategory, recipeCategoryList)
                        categoryList = converterDB.convertCategoryList(resultCategory, subcategoryList)

                        var categories = []

                        categoryList.forEach(category => {
                            model = category.toJson()
                            categories.push(model)
                        })

                        resolve(categories)
                    } catch(ex) {
                        console.log("ex = " + ex)
                        reject(-1)
                    }
    
                })
            });
        });
    });
}

// Recipe By Categoru And Subcategory=========================================
exports.getRecipesByCategoryId = (categoryId, subCategoryId, recipeCategoryId, limitItems, numberPerPage, currentPage) => {
    ///SELECT ITEMS
    const select = "SELECT id, name, comment, image_url, create_at, portion_count, cook_time, is_active FROM recipe " + 
                "WHERE id_category = " + categoryId + " "
                "AND id_subcategory = " + subCategoryId + " ";

    var count = "SELECT count(*) as numRows FROM recipe " + 
            "WHERE id_category = " + categoryId + " "
            "AND id_subcategory = " + subCategoryId + " ";

    const whereRecipeCategoryId = "AND id_recipe_category = " + recipeCategoryId + " ";
    const orderBy = "ORDER BY create_at ";
    const limit = "LIMIT " + limitItems;

    var SELECT_RECIPE = select
    var COUNT = count

    if(recipeCategoryId != undefined) {
        SELECT_RECIPE = SELECT_RECIPE + whereRecipeCategoryId;
        COUNT = COUNT + whereRecipeCategoryId;
    }

    SELECT_RECIPE = SELECT_RECIPE + orderBy + limit
    COUNT = COUNT + orderBy

    
    return new Promise((mainResolve, mainReject) => {
        async.parallel([
            ///COUNT OF ITEMS
            function(callback) {
                database.query(COUNT, (err, result) => {
                    if(err) {
                        return callback(err, null)
                    }
    
                    try {
                        var numRows = result[0].numRows;
                        console.log("numRows = " + numRows)
                        var numPages = Math.ceil(numRows / numberPerPage);

                        return callback(null, numPages)
                    } catch(ex) {
                        console.log("ex = " + ex)
                        return callback(ex, null)
                    }
                })
            }, 

            ///GET RECIPE LIST WITH ALL INFO
            function(callback) {
                database.query(SELECT_RECIPE, (error, result) => {
                    if(error) {
                        return callback(error, null)
                        // mainReject(error)
                    }
        
                    try {
                        var recipeList = converterDB.convertRecipeList(result)
                        recipes = []
        
                        Promise.all(recipeList.map(function(recipe) {
                            var promise = new Promise(function(resolve, reject) {
                                if(recipe.id != undefined) {
                                    getMultipleRecipe(recipe).then((jsonModel) => {
                                        resolve(jsonModel);
                                    }).catch((error) => {
                                        reject(error)
                                    })
                                } else {
                                    resolve(undefined)
                                }
                            })
        
                            return promise.then((result) => {
                                if(result != undefined) {
                                    recipes.push(result)
                                }
                            }).catch((error) => {
                                // throw error
                            })
                        })).then(() => {
                            return callback(null, recipes)
                            // mainResolve(recipes)
                        }).catch((error) => {
                            console.log("error: " + error)
                            return callback(error, null)
                            // mainReject(error)
                        })
        
                    } catch(ex) {
                        console.log("ex = " + ex)
                        return callback(ex, null)
                        // mainReject(-1)
                    }
                })
            }
        ], function(error, callback) {
            if(error) {
                mainReject(error)
            }

            var numPages = callback[0]
            var recipes = callback[1]

            var model = {
                "itemsPerPage" : numberPerPage,
                "totalPages" : numPages,
                "currentPage" : currentPage,
                "recipes" : recipes
            }

            mainResolve(model)
        })
    })
}

//Get Categories, Kitchens, Tasties, Appointment
exports.getCategoryKitchenTasty = () => {
    return new Promise((resolve, reject) => {

        async.parallel([
            //Categories and Subcategories
            function(callback) {
                const selectCategory = generalSelect('category', 'id, name');
                const selectSubcategory = generalSelect('subcategory', 'id, name, id_category');
                const selectRecipeCategory = generalSelect('recipe_category', 'id, name, id_subcategory');
                
                database.query(selectCategory, (errCategory, resultCategory) => {
                    if(errCategory) {
                        return callback(errCategory, null)
                    }
            
                    database.query(selectSubcategory, (errSubcategory, resultSubcategory) => {
                        if(errSubcategory) {
                            return callback(errSubcategory, null)
                        }
            
                        database.query(selectRecipeCategory, (errRecipeCategory, resultRecipeCategory) => {
                            if(errRecipeCategory) {
                                return callback(errRecipeCategory, null)
                            }
            
                            try {
                                recipeCategoryList = converterDB.convertRecipeCategoryList(resultRecipeCategory)
                                subcategoryList = converterDB.convertSubategoryList(resultSubcategory, recipeCategoryList)
                                categoryList = converterDB.convertCategoryList(resultCategory, subcategoryList)
        
                                var categories = []
        
                                categoryList.forEach(category => {
                                    model = category.toJson()
                                    categories.push(model)
                                })
        
                                return callback(null, categories)
                            } catch(ex) {
                                console.log("ex = " + ex)
                                return callback(ex, null)
                            }
            
                        })
                    });
                })
            },

            //Kitchens
            function(callback) {
                const selectKitchenList = 'SELECT id, name FROM kitchen;'
                
                database.query(selectKitchenList, (error, result) => {
                    if(error) {
                        return callback(error, null)
                    }
        
                    try {
                        var kitchenList = converterDB.convertKitchenList(result)//convertKitchen(result)

                        kitchens = []
                        kitchenList.forEach(kitchen => {
                            kitchens.push(kitchen.toJson())
                        })
        
                        return callback(null, kitchens)
                    } catch(ex) {
                        console.log("ex = " + ex)
                        return callback(ex, null)
                    }
                })
            },

            //Tastes
            function(callback) {
                const selectTastesList = 'SELECT id, name FROM tastes;'
                
                database.query(selectTastesList, (error, result) => {
                    if(error) {
                        return callback(error, null)
                    }
        
                    try {
                        var tastyList = converterDB.convertTastesList(result)

                        tasties = []
                        tastyList.forEach(tasty => {
                            tasties.push(tasty.toJson())
                        })
        
                        return callback(null, tasties)
                    } catch(ex) {
                        console.log("ex = " + ex)
                        return callback(ex, null)
                    }
                })
            },
        ], function(error, callbackResults) {
            if(error) {
                reject(error)
            }

            var categories = callbackResults[0]
            var kitchens = callbackResults[1]
            var tastes = callbackResults[2]
        

            var model = {
                "categories" : categories,
                "kitchens" : kitchens,
                "tastes" : tastes,
            }
    
            resolve(model)
        })
    })
}

//Get Recipe by ID_____________________________________
exports.getRecipeById = (recipeId) => {

    return new Promise((resolve, reject) => {
        async.parallel([
            //Recipe
            function(callback) {
                const selectRecipe = "SELECT id, name, comment, image_url, create_at, portion_count, cook_time, is_active FROM recipe " + 
                    "WHERE id = " + recipeId;
    
                    database.query(selectRecipe, (error, result) => {
                        if(error) {
                            return callback(error, null)
                        }
            
                        try {
                            var recipeList = converterDB.convertRecipeList(result)

                            recipes = []
                            recipeList.forEach(recipe => {
                                recipes.push(recipe.toJson())
                            })
            
                            return callback(null, recipes)
                        } catch(ex) {
                            console.log("ex = " + ex)
                            return callback(ex, null)
                        }
                    })
            }, 
    
            //Ingredients
            function(callback) {
                var selectIngredient = "SELECT id, name, value, description " +
                                 "FROM ingredient i " + 
                                "INNER JOIN recipe_ingredient ri " +
                                "ON i.id = ri.id_ingredient " +
                                "WHERE ri.id_recipe = " + recipeId;
                database.query(selectIngredient, (error, result) => {
                    if(error) {
                        return callback(error, null)
                    }
        
                    try {
                        var ingredientsList = converterDB.convertIngredientsList(result)

                        ingredients = []

                        ingredientsList.forEach(ingredient => {
                            ingredients.push(ingredient.toJson())
                        })
        
                        return callback(null, ingredients)
                    } catch(ex) {
                        console.log("ex = " + ex)
                        return callback(ex, null)
                    }
                })
    
            },
    
            // //Energy
            function(callback) {
                var selectEnergyTable = "SELECT id, name, kcal_value, squirrels_value, grease_value, carbohydrates_value " +
                                 "FROM energy e INNER JOIN recipe_energy re " +
                                "ON e.id = re.id_energy " +
                                "WHERE re.id_recipe = " + recipeId;
    
                database.query(selectEnergyTable, (error, result) => {
                    if(error) {
                        return callback(error, null)
                    }
        
                    try {
                        var energyList = converterDB.convertEnergyList(result)

                        energies = []

                        energyList.forEach(energy => {
                            energies.push(energy.toJson())
                        })
        
                        return callback(null, energyList)
                    } catch(ex) {
                        console.log("ex = " + ex)
                        return callback(ex, null)
                    }
                })
            },
    
            //CookSteps
            function(callback) {
                var selectCookStep = "SELECT id, step, description, image_url " +
                                 "FROM cook_step cs INNER JOIN recipe_cook_step rcs " +
                                "ON cs.id = rcs.id_cook_step " +
                                "WHERE rcs.id_recipe = " + recipeId;
    
                database.query(selectCookStep, (error, result) => {
                    if(error) {
                        return callback(error, null)
                    }
        
                    try {
                        var cookStepsList = converterDB.convertCookStepList(result)
                        cookSteps = []

                        cookStepsList.forEach(cookStep => {
                            cookSteps.push(cookStep.toJson())
                        })


        
                        return callback(null, cookSteps)
                    } catch(ex) {
                        console.log("ex = " + ex)
                        return callback(ex, null)
                    }
                })
            },
    
            // //Tags
            function(callback) {
                var selectTags = "SELECT id, name " +
                                 "FROM tag t " + 
                                 "INNER JOIN recipe_tag rt " +
                                "ON t.id = rt.id_tag " +
                                "WHERE rt.id_recipe = " + recipeId;
    
                database.query(selectTags, (error, result) => {
                    if(error) {
                        return callback(error, null)
                    }
        
                    try {
                        var tagsList = converterDB.convertTagsList(result)
                        tags = []

                        tagsList.forEach(tag => {
                            tags.push(tag.toJson())
                        })
        
                        return callback(null, tags)
                    } catch(ex) {
                        console.log("ex = " + ex)
                        return callback(ex, null)
                    }
                })
            },
    
            // Tasties
            function(callback) {
                var selectTastes = "SELECT id, name " +
                                 "FROM tastes t " + 
                                 "INNER JOIN recipe_tastes rt " +
                                "ON t.id = rt.id_tastes " +
                                "WHERE rt.id_recipe = " + recipeId;
    
                database.query(selectTastes, (error, result) => {
                    if(error) {
                        return callback(error, null)
                    }
        
                    try {
                        var tastesList = converterDB.convertTastesList(result)
                        tastes = []

                        tastesList.forEach(tasty => {
                            tastes.push(tasty)
                        })
        
                        return callback(null, tastes)
                    } catch(ex) {
                        console.log("ex = " + ex)
                        return callback(ex, null)
                    }
                })
            }
    
    
        ], 
        function(error, callbackResults) {
            if(error) {
                reject(error)
            }
    
            var recipeModel = callbackResults[0]
            var ingredientsModel = callbackResults[1]
            var energiesModel = callbackResults[2]
            var cookStepsModel = callbackResults[3]
            var tagsModel = callbackResults[4]
            var tastiesModel = callbackResults[5]
    
            var model = {
                "recipe" : recipeModel,
                "ingredients" : ingredientsModel,
                "energies" : energiesModel,
                "cookSteps" : cookStepsModel,
                "tags" : tagsModel,
                "tastes" : tastiesModel,
            }
    
            resolve(model)
        })
    })
}

//Get Recipe by tag ID_________________________________
exports.getRecipeListByTagId = (tagId, limit, numberPerPage, currentPage) => {
    const select = "SELECT id, name, comment, image_url, create_at, portion_count, cook_time, is_active FROM recipe r " + 
    "INNER JOIN recipe_tag rt " +
    "ON r.id = rt.id_recipe " +
    "WHERE rt.id_tag = " + tagId + " " +
    "LIMIT " + limit;

    const count = 'SELECT count(*) as numRows ' +
        'FROM recipe r ' +
        'INNER JOIN recipe_tag rt ' + 
        'ON r.id = rt.id_recipe ' + 
        'WHERE rt.id_tag = ' + tagId;

    return new Promise((resolve, reject) => {
        async.parallel([

            //Get numPages
            function(callback) {
                database.query(count, (err, result) => {
                    if(err) {
                        return callback(err, null)
                    }
    
                    try {
                        var numRows = result[0].numRows;
                        var numPages = Math.ceil(numRows / numberPerPage);

                        return callback(null, numPages)
                    } catch(ex) {
                        console.log("ex = " + ex)
                        return callback(ex, null)
                    }
                })
            },

            //Get recipe list
            function(callback) {
                database.query(select, (error, result) => {
                    if(error) {
                        return callback(error, null)
                    }
        
                    try {
                        var recipeList = converterDB.convertRecipeList(result)
                        recipes = []
        
                        recipeList.forEach(recipe => {
                            recipes.push(recipe.toJson())
                        })
        
                        return callback(null, recipes)
                    } catch(ex) {
                        console.log("ex = " + ex)
                        return callback(ex, null)
                    }
                })
            }

        ], function(error, callbackResults) {
            if(error) {
                reject(error)
            }

            var numPages = callbackResults[0]
            var recipes = callbackResults[1]
        
            var model = {
                "itemsPerPage" : numberPerPage,
                "totalPages" : numPages,
                "currentPage" : currentPage,
                "recipes" : recipes
            }
    
            resolve(model)
        })
    
    })
}

//Get Recipe by tag ID_________________________________
exports.getRecipeListByKitchenId = (kitchenId, limit, numberPerPage, currentPage) => {
    const select = "SELECT id, name, comment, image_url, create_at, portion_count, cook_time, is_active FROM recipe " + 
    "WHERE id_kitchen = " + kitchenId + " " +
    "LIMIT " + limit;

    const count = 'SELECT count(*) as numRows ' +
        'FROM recipe ' +
        'WHERE id_kitchen = ' + kitchenId + ' ';

    return new Promise((resolve, reject) => {
        async.parallel([

            //Get numPages
            function(callback) {
                database.query(count, (err, result) => {
                    if(err) {
                        return callback(err, null)
                    }
    
                    try {
                        var numRows = result[0].numRows;
                        var numPages = Math.ceil(numRows / numberPerPage);

                        return callback(null, numPages)
                    } catch(ex) {
                        console.log("ex = " + ex)
                        return callback(ex, null)
                    }
                })
            },

            //Get recipe list
            function(callback) {
                database.query(select, (error, result) => {
                    if(error) {
                        return callback(error, null)
                    }
        
                    try {
                        var recipeList = converterDB.convertRecipeList(result)
                        recipes = []
        
                        recipeList.forEach(recipe => {
                            recipes.push(recipe.toJson())
                        })
        
                        return callback(null, recipes)
                    } catch(ex) {
                        console.log("ex = " + ex)
                        return callback(ex, null)
                    }
                })
            }

        ], function(error, callbackResults) {
            if(error) {
                reject(error)
            }

            var numPages = callbackResults[0]
            var recipes = callbackResults[1]
        
            var model = {
                "itemsPerPage" : numberPerPage,
                "totalPages" : numPages,
                "currentPage" : currentPage,
                "recipes" : recipes
            }
    
            resolve(model)
        })
    
    })
}

function getMultipleRecipe(recipe) {
    const recipeId = recipe.id;

    return new Promise((resolve, reject) => {
        async.parallel([
    
            //Ingredients
            function(callback) {
                var selectIngredient = "SELECT id, name, value, description " +
                                 "FROM ingredient i " + 
                                "INNER JOIN recipe_ingredient ri " +
                                "ON i.id = ri.id_ingredient " +
                                "WHERE ri.id_recipe = " + recipeId;
                database.query(selectIngredient, (error, result) => {
                    if(error) {
                        return callback(error, null)
                    }
        
                    try {
                        var ingredientsList = converterDB.convertIngredientsList(result)

                        ingredients = []

                        ingredientsList.forEach(ingredient => {
                            ingredients.push(ingredient.toJson())
                        })
        
                        return callback(null, ingredients)
                    } catch(ex) {
                        console.log("ex = " + ex)
                        return callback(ex, null)
                    }
                })
    
            },
    
            // //Energy
            function(callback) {
                var selectEnergyTable = "SELECT id, name, kcal_value, squirrels_value, grease_value, carbohydrates_value " +
                                 "FROM energy e INNER JOIN recipe_energy re " +
                                "ON e.id = re.id_energy " +
                                "WHERE re.id_recipe = " + recipeId;
    
                database.query(selectEnergyTable, (error, result) => {
                    if(error) {
                        return callback(error, null)
                    }
        
                    try {
                        var energyList = converterDB.convertEnergyList(result)

                        energies = []

                        energyList.forEach(energy => {
                            energies.push(energy.toJson())
                        })
        
                        return callback(null, energyList)
                    } catch(ex) {
                        console.log("ex = " + ex)
                        return callback(ex, null)
                    }
                })
            },
    
            //CookSteps
            function(callback) {
                var selectCookStep = "SELECT id, step, description, image_url " +
                                 "FROM cook_step cs INNER JOIN recipe_cook_step rcs " +
                                "ON cs.id = rcs.id_cook_step " +
                                "WHERE rcs.id_recipe = " + recipeId;
    
                database.query(selectCookStep, (error, result) => {
                    if(error) {
                        return callback(error, null)
                    }
        
                    try {
                        var cookStepsList = converterDB.convertCookStepList(result)
                        cookSteps = []

                        cookStepsList.forEach(cookStep => {
                            cookSteps.push(cookStep.toJson())
                        })


        
                        return callback(null, cookSteps)
                    } catch(ex) {
                        console.log("ex = " + ex)
                        return callback(ex, null)
                    }
                })
            },
    
            // //Tags
            function(callback) {
                var selectTags = "SELECT id, name " +
                                 "FROM tag t " + 
                                 "INNER JOIN recipe_tag rt " +
                                "ON t.id = rt.id_tag " +
                                "WHERE rt.id_recipe = " + recipeId;
    
                database.query(selectTags, (error, result) => {
                    if(error) {
                        return callback(error, null)
                    }
        
                    try {
                        var tagsList = converterDB.convertTagsList(result)
                        tags = []

                        tagsList.forEach(tag => {
                            tags.push(tag.toJson())
                        })
        
                        return callback(null, tags)
                    } catch(ex) {
                        console.log("ex = " + ex)
                        return callback(ex, null)
                    }
                })
            },
    
            // Tasties
            function(callback) {
                var selectTastes = "SELECT id, name " +
                                 "FROM tastes t " + 
                                 "INNER JOIN recipe_tastes rt " +
                                "ON t.id = rt.id_tastes " +
                                "WHERE rt.id_recipe = " + recipeId;
    
                database.query(selectTastes, (error, result) => {
                    if(error) {
                        return callback(error, null)
                    }
        
                    try {
                        var tastesList = converterDB.convertTastesList(result)
                        tastes = []

                        tastesList.forEach(tasty => {
                            tastes.push(tasty)
                        })
        
                        return callback(null, tastes)
                    } catch(ex) {
                        console.log("ex = " + ex)
                        return callback(ex, null)
                    }
                })
            }
    
    
        ], 
        function(error, callbackResults) {
            if(error) {
                reject(error)
            }
    
            var recipeModel = recipe.toJson()
            var ingredientsModel = callbackResults[0]
            var energiesModel = callbackResults[1]
            var cookStepsModel = callbackResults[2]
            var tagsModel = callbackResults[3]
            var tastiesModel = callbackResults[4]
    
            var model = {
                "recipe" : recipeModel,
                "ingredients" : ingredientsModel,
                "energies" : energiesModel,
                "cookSteps" : cookStepsModel,
                "tags" : tagsModel,
                "tastes" : tastiesModel,
            }
    
            resolve(model)
        })
    })
}