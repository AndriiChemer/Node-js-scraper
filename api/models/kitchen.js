module.exports = class Kitchen {
    
    constructor(id, name) {
        this.id = id
        this.name = name
    }

    toJson() {
        return {
            "id": this.id,
            "name": this.name
        }
    }

    static getFromRow(row) {
        return new Kitchen(row.id, row.name)
    }
};