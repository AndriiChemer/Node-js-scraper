module.exports = class CookStep {
    
    constructor(id, step, description, image_url) {
        this.id = id
        this.step = step
        this.description = description
        this.image_url = image_url
    }

    static getFromRow(row) {
        return new CookStep(row.id, row.step, row.description, row.image_url)
    }
};