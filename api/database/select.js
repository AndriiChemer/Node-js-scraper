const database = require('./connection');
var async = require('async');

const Category = require('../models/category')
const Subcategory = require('../models/subcategory')
const RecipeCategory = require('../models/recipeCategory')
const Recipe = require("../models/recipe")
const Ingredient = require("../models/ingredient")
const Energy = require("../models/energy") 
const CookStep = require("../models/cookstep") 
const Tag = require("../models/tag") 
const Tasty = require("../models/tasty") 

function generalSelect(column, params) {
    return 'SELECT ' + params + ' FROM ' + column ;
}

// Get list of json category with subcategory and subSubCategory
exports.selectCategory = (categoryName) => {
    
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
                        recipeCategoryList = convertRecipeCategory(resultRecipeCategory)
                        subcategoryList = convertSubategory(resultSubcategory, recipeCategoryList)
                        categoryList = convertCategory(resultCategory, subcategoryList)

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

function convertCategory(rows, subcategoryList) {
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

function convertSubategory(rows, recipeCategoryList) {
    var listSubcategory = []
    rows.forEach(row => {
        model = Subcategory.getFromRow(row)

        recipeCategoryList.forEach(recipeCategory => {
            if(recipeCategory.subcategoryId == model.id) {
                model.addToList(recipeCategory)
            }
        });
        listSubcategory.push(model)
        // console.log("subcategory = " + JSON.stringify(model))
    });

    // console.log("\n\n")
    return listSubcategory
}

function convertRecipeCategory(rows) {
    var listRecipeCategory = []
    rows.forEach(row => {
        model = RecipeCategory.getFromRow(row)
        listRecipeCategory.push(model)
    });

    return listRecipeCategory
}

exports.test = () => {
    const selectCategory = generalSelect('category', 'id, name');
    const selectSubcategory = generalSelect('subcategory', 'id, name, id_category');
    const selectRecipeCategory = generalSelect('recipe_category', 'id, name, id_subcategory');

    database.query(selectCategory, (errCategory, resultCategory) => {
        if(errCategory) {
            console.log("errCategory = " + errCategory)
        }

        database.query(selectSubcategory, (errSubcategory, resultSubcategory) => {
            if(errSubcategory) {
                console.log("errSubcategory = " + errSubcategory)
            }

            database.query(selectRecipeCategory, (errRecipeCategory, resultRecipeCategory) => {
                if(errRecipeCategory) {
                    console.log("errRecipeCategory = " + errRecipeCategory)
                }

                try {
                    recipeCategoryList = convertRecipeCategory(resultRecipeCategory)
                    subcategoryList = convertSubategory(resultSubcategory, recipeCategoryList)
                    categoryList = convertCategory(resultCategory, subcategoryList)
                    
                } catch(ex) {
                    console.log("ex = " + ex)
                }

            })
        });
    });
}

// Recipe with ingredients =========================================
exports.getRecipesWithIngredientsByCategoryId = (categoryId, subCategoryId, recipeCategoryId) => {

    const selectRecipe = "SELECT  r.id, r.name, comment, r.image_url, create_at, portion_count, cook_time, " 
                + "is_active, i.id as ingredientId, i.name as ingredientName,i.value as ingredientValue, i.description as descriptionValue " 
                + "FROM recipe r "
                + "INNER JOIN recipe_ingredient ri "
                + "ON r.id = ri.id_recipe "
                + "INNER JOIN ingredient i "
                + "ON i.id = ri.id_ingredient "
                + "ORDER BY r.id LIMIT 10;";

    
    return new Promise((resolve, reject) => {
        database.query(selectRecipe, (error, result) => {
            if(error) {
                reject(error)
            }

            try {
                var recipeList = convertRecipeWithIngredientsList(result)

                resolve(JSON.stringify(recipeList))
            } catch(ex) {
                console.log("ex = " + ex)
                reject(-1)
            }
        })
    })
}

function convertRecipeWithIngredientsList(rows) {
    

    recipeList = []
    ids = []
    
    rows.forEach(row => {
        var model = Recipe.getFromRow(row)

        if(ids.includes(row.id)) {
            recipeList.forEach(recipe => {
                if (recipe.id == model.id) {
                    recipe.addIngredients(row)
                    return;
                }
            })
            
        } else {
            ids.push(row.id)
            model.addIngredients(row)
            recipeList.push(model)
        }
    });

    return recipeList
}

// Recipe =========================================
exports.getRecipesByCategoryId = (categoryId, subCategoryId, recipeCategoryId) => {
    const selectRecipe = "SELECT id, name, comment, image_url, create_at, portion_count, cook_time, is_active FROM recipe " + 
                "WHERE id_category = " + categoryId + " " +
                "AND id_subcategory = " + subCategoryId + " " +
                "AND id_recipe_category = " + recipeCategoryId + " " +
                "ORDER BY id"
    
    return new Promise((resolve, reject) => {
        database.query(selectRecipe, (error, result) => {
            if(error) {
                reject(error)
            }

            try {
                var recipeList = convertRecipeList(result)

                resolve(JSON.stringify(recipeList))
            } catch(ex) {
                console.log("ex = " + ex)
                reject(-1)
            }
        })
    })
}

function convertRecipeList(resultList) {
    recipeList = []
    
    resultList.forEach(row => {
        var model = Recipe.getFromRow(row)
        recipeList.push(model)
    });

    return recipeList
}

//Ingredient =========================================
exports.getIngredientsByRecipeId = (recipeId) => { 
    var selectIngredient = "SELECT id, name, value, description " +
                             "FROM ingredient i " + 
                            "INNER JOIN recipe_ingredient ri " +
                            "ON i.id = ri.id_ingredient " +
                            "WHERE ri.id_recipe = " + recipeId;

    return new Promise((resolve, reject) => {
        database.query(selectIngredient, (error, result) => {
            if(error) {
                reject(error)
            }

            try {
                var ingredientsList = convertIngredientsList(result)

                resolve(JSON.stringify(ingredientsList))
            } catch(ex) {
                console.log("ex = " + ex)
                reject(-1)
            }
        })
    })
}

function convertIngredientsList(resultList) {
    ingredientsList = []
    
    resultList.forEach(row => {
        var model = Ingredient.getFromRow(row)
        ingredientsList.push(model)
    });

    return ingredientsList
}

// Energy =========================================
exports.getEnergyTableByRecipeId = (recipeId) => { 
    var selectEnergyTable = "SELECT id, name, kcal_value, squirrels_value, grease_value, carbohydrates_value " +
                             "FROM energy e INNER JOIN recipe_energy re " +
                            "ON e.id = re.id_energy " +
                            "WHERE re.id_recipe = = " + recipeId;

    return new Promise((resolve, reject) => {
        database.query(selectEnergyTable, (error, result) => {
            if(error) {
                reject(error)
            }

            try {
                var energyList = convertEnergyList(result)

                resolve(JSON.stringify(energyList))
            } catch(ex) {
                console.log("ex = " + ex)
                reject(-1)
            }
        })
    })
}

function convertEnergyList(resultList) {
    energyList = []
    
    resultList.forEach(row => {
        var model = Energy.getFromRow(row)
        energyList.push(model)
    });

    return energyList
}

// CookStep =========================================
exports.getCookStepsByRecipeId = (recipeId) => { 
    var selectCookStep = "SELECT id, step, description, image_url " +
                             "FROM cook_step cs INNER JOIN recipe_cook_step rcs " +
                            "ON cs.id = rcs.id_cook_step " +
                            "WHERE rcs.id_recipe = " + recipeId;

    return new Promise((resolve, reject) => {
        database.query(selectCookStep, (error, result) => {
            if(error) {
                reject(error)
            }

            try {
                var cookSteps = convertCookSteps(result)

                resolve(JSON.stringify(cookSteps))
            } catch(ex) {
                console.log("ex = " + ex)
                reject(-1)
            }
        })
    })
}

function convertCookSteps(resultList) {
    cookSteps = []
    
    resultList.forEach(row => {
        var model = CookStep.getFromRow(row)
        cookSteps.push(model)
    });

    return cookSteps
}

// Tags =========================================
exports.getTagsByRecipeId = (recipeId) => { 
    var selectTags = "SELECT id, name " +
                             "FROM tag t " + 
                             "INNER JOIN recipe_tag rt " +
                            "ON t.id = rt.id_tag " +
                            "WHERE rt.id_recipe = = " + recipeId;

    return new Promise((resolve, reject) => {
        database.query(selectTags, (error, result) => {
            if(error) {
                reject(error)
            }

            try {
                var tagsList = convertTagsList(result)

                resolve(JSON.stringify(energyList))
            } catch(ex) {
                console.log("ex = " + ex)
                reject(-1)
            }
        })
    })
}

function convertTagsList(resultList) {
    tagsList = []
    
    resultList.forEach(row => {
        var model = Tag.getFromRow(row)
        tagsList.push(model)
    });

    return tagsList
}


// Tasty =========================================
exports.getTastesByRecipeId = (recipeId) => { 

    var selectTastes = "SELECT id, name " +
                             "FROM tastes t " + 
                             "INNER JOIN recipe_tastes rt " +
                            "ON t.id = rt.id_tastes " +
                            "WHERE rt.id_recipe = = " + recipeId;

    return new Promise((resolve, reject) => {
        database.query(selectTastes, (error, result) => {
            if(error) {
                reject(error)
            }

            try {
                var tastesList = convertTastesList(result)

                resolve(JSON.stringify(tastesList))
            } catch(ex) {
                console.log("ex = " + ex)
                reject(-1)
            }
        })
    })
}

function convertTastesList(resultList) {
    tastesList = []
    
    resultList.forEach(row => {
        var model = Tasty.getFromRow(row)
        tastesList.push(model)
    });

    return tastesList
}







exports.getMultipleRecipe = (recipeId) => {

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
                            var recipeList = convertRecipeList(result)
            
                            return callback(null, JSON.stringify(recipeList))
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
                        var ingredientsList = convertIngredientsList(result)
        
                        return callback(null, JSON.stringify(ingredientsList))
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
                        var energyList = convertEnergyList(result)
        
                        return callback(null, JSON.stringify(energyList))
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
                        var cookSteps = convertCookSteps(result)
        
                        return callback(null, JSON.stringify(cookSteps))
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
                        var tagsList = convertTagsList(result)
        
                        return callback(null, JSON.stringify(tagsList))
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
                        var tastesList = convertTastesList(result)
        
                        return callback(null, JSON.stringify(tastesList))
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