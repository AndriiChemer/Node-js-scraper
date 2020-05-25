module.exports = class RecipeCategory {

    constructor(row) {
        this.id = row.id
        this.name = row.name
        this.subcategoryId = row.id_subcategory
    }

    toJson() {
        return {
            "recipeCategoryId": this.id,
            "recipeCategoryName": this.name,
        }
    }
};