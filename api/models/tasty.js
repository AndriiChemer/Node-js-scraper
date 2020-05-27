module.exports = class Tasty {
    
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
        return new Tasty(row.id, row.name)
    }
};