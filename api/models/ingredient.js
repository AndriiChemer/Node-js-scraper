module.exports = class Ingredient {
    
    constructor(id, name, value, description) {
        this.id = id
        this.name = name
        this.value = value
        this.description = description
    }

    toJson() {
        return {
            "id": this.id,
            "name": this.name,
            "value": this.value,
            "description": this.description,
        }
    }

    static getFromRow(row) {
        return new Ingredient(row.id, row.name, row.value, row.description)
    }
};