module.exports = class Energy {
    
    constructor(id, name, kcal_value, squirrels_value, grease_value, carbohydrates_value) {
        this.id = id
        this.name = name
        this.kcal = kcal_value
        this.squirrels = squirrels_value
        this.grease = grease_value
        this.carbohydrates = carbohydrates_value
    }

    toJson() {
        return {
            "id": this.id ,
            "name": this.name ,
            "kcal": this.kcal ,
            "squirrels": this.squirrels ,
            "grease": this.grease ,
            "carbohydrates": this.carbohydrates ,
        }
    }

    static getFromRow(row) {
        return new Energy(row.id, row.name, row.kcal_value, row.squirrels_value, row.grease_value , row.carbohydrates_value)
    }
};