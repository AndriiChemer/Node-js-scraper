const database = require('./connection');
const Category = require('../models/category')
const Subcategory = require('../models/subcategory')
const RecipeCategory = require('../models/recipeCategory')

function generalSelect(column, params) {
    return 'SELECT ' + params + ' FROM ' + column ;
}

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

                        resolve(categoryList)
                    } catch(ex) {
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
        model = new Category(row)

        subcategoryList.forEach(subcategory => {
            if(model.id == subcategory.categoryId) {
                model.addToList(subcategory)
                model.addToJsonList(JSON.stringify(subcategory))
            }
        });

        listCategory.push(JSON.stringify(model))
    });

    return listCategory
}

function convertSubategory(rows, recipeCategoryList) {
    var listSubcategory = []
    rows.forEach(row => {
        model = new Subcategory(row)

        recipeCategoryList.forEach(recipeCategory => {
            if(recipeCategory.subcategoryId == model.id) {
                model.addToList(recipeCategory)
                model.addToJsonList(JSON.stringify(recipeCategory))
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
        model = new RecipeCategory(row)
        listRecipeCategory.push(model)
    });

    return listRecipeCategory
}

exports.testGetCategory = () => {
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
                    
                    

                    var categoryJson = convertAll(categoryList, subcategoryList, recipeCategoryList)

                    console.log("json = " + categoryJson)
                } catch(ex) {
                    console.log("ex = " + ex)
                }

            })
        });
    });
}

function convertAll(categoryList, subcategoryList, recipeCategoryList) {
    var jsonModel = []

    subcategoryList.forEach(subcategory => {
        recipeCategoryList.forEach(recipeCategory => {
            if(subcategory.id == recipeCategory.subcategoryId) {
                subcategory.recipeCategoryList.push(recipeCategory)
            }
        });
    });

    categoryList.forEach(category => {
        subcategoryList.forEach(subcategory => {
            if(category.id == subcategory.categoryId) {
                category.categoryList.push(subcategory)
            }
        });

        jsonModel.push(category.toJson())
    })

    
    return jsonModel
}