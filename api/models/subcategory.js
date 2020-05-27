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

    static getFromRow(row) {
        return new Subcategory(row.id, row.name, row.id_category)
    }

};