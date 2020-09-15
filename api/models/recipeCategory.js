module.exports = class RecipeCategory {

    constructor(id, name, id_subcategory) {
        this.id = id
        this.name = name
        this.subcategoryId = id_subcategory
    }

    toJson() {
        return {
            "id": this.id,
            "name": this.name,
            "imageName": this.imageName,
            "subcategoryId": this.subcategoryId,
        }
    }

    static getFromRow(row) {
        return new RecipeCategory(row.id, row.name, row.id_subcategory)
    }
};