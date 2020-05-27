module.exports = class Subcategory {

    constructor(id, name, id_category) {
        this.id = id
        this.name = name
        this.categoryId = id_category
        this.recipeCategoryList = []
    }

    addToList(model) {
        this.recipeCategoryList.push(model)
    }

    toJson() {
        var recipeCategoryJsonArray = []

        this.recipeCategoryList.forEach(recipeCategory => {
            recipeCategoryJsonArray.push(recipeCategory.toJson())
        })


        return {
            "id": this.id,
            "name": this.name,
            "categoryId": this.categoryId,
            "recipeCategories": recipeCategoryJsonArray
        }
    }

    static getFromRow(row) {
        return new Subcategory(row.id, row.name, row.id_category)
    }

};