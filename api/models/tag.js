module.exports = class Tag {
    
    constructor(id, name) {
        this.id = id
        this.name = name
    }

    static getFromRow(row) {
        return new Tag(row.id, row.name)
    }
};