module.exports = class Category {
    
    constructor(id, name, imageName) {
        this.id = id
        this.name = name
        this.imageName = imageName
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
            "imageName": this.imageName,
            "subcategories": subcategoryJsonArray
        }
    }

    static getFromRow(row) {
        return new Category(row.id, row.name, row.imageName)
    }

    addToList(model) {
        this.subcategoryList.push(model)
    }
};