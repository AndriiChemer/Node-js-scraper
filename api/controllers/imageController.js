const fs = require('fs');
exports.get_image_by_name = (req, res, next) => {
    var image = req.params.image
    console.log(`image: ${image}`)

    var fullImagePath = __dirname + "/images/categories/" + image

    if (fs.existsSync(fullImagePath)) {
        var stream = fs.createReadStream(fullImagePath)
        stream.on('open', function () {
            stream.pipe(res)
        })
    } else {
        res.status(501).json({
            statusCode: 400,
            status: 'Error',
            errorBody: "File does't exist"
        });
    } 
}

//  UPDATE recipe.category SET imageName = "hot_dish.jpg" WHERE id = 44;
