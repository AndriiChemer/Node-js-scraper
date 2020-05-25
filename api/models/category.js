module.exports = class Category {
    
    constructor(row) {
        this.id = row.id
        this.name = row.name
        this.subcategoryListJson = []
        this.subcategoryList = []
    }

    addToList(model) {
        this.subcategoryList.push(model)
    }

    addToJsonList(jsonModel) {
        this.subcategoryListJson.push(jsonModel)
    };

    toJson() {
        // this.subcategoryList.forEach(element => {
        //     this.subcategoryListJson.push(element.toJson())
        // });
        return {
            "categoryId": this.id,
            "categoryName": this.name,
            "subcategoryList": this.subcategoryListJson
        }
    }
};