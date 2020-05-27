module.exports = class Category {
    
    constructor(id, name) {
        this.id = id
        this.name = name
        this.subcategoryList = []
    }

    toJson() {
        var subcategoryJsonArray = []

        this.subcategoryList.forEach(subcategory => {
            subcategoryJsonArray.push(subcategory.toJson())
        })


        return {
            "id": this.id,
            "name": this.name,
            "subcategories": subcategoryJsonArray
        }
    }

    static getFromRow(row) {
        return new Category(row.id, row.name)
    }

    addToList(model) {
        this.subcategoryList.push(model)
    }
};