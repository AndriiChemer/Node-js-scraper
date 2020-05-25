module.exports = class Subcategory {

    constructor(row) {
        this.id = row.id
        this.name = row.name
        this.categoryId = row.id_category
        this.recipeCategoryListJson = []
        this.recipeCategoryList = []
    }

    addToList(model) {
        this.recipeCategoryList.push(model)
    }

    addToJsonList(jsonModel) {
        this.recipeCategoryListJson.push(jsonModel)
    }

    toJson() {
        // this.recipeCategoryList.forEach(element => {
        //     this.recipeCategoryListJson.push(element.toJson())
        // });

        return {
            "subcategoryId": this.id,
            "subcategoryName": this.name,
            "recipeCategoryList": this.recipeCategoryListJson.length == 0 ? null : this.recipeCategoryListJson
        }
    }
};