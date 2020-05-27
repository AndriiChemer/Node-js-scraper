module.exports = class Category {
    
    constructor(id, name) {
        this.id = id
        this.name = name
        this.subcategoryList = []
    }

    static getFromRow(row) {
        return new Category(row.id, row.name)
    }

    addToList(model) {
        this.subcategoryList.push(model)
    }
};