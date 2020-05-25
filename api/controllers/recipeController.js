const SELECT = require('../database/select')

exports.test = (req, res, next) => {

    SELECT.selectCategory().then((jsonObject) => {

        res.status(200).json({
            statusCode: 200,
            status: 'Successfull',
            body: jsonObject
        });
    }).catch((error) => {
        if(error == -1){
            res.status(501).json({
                statusCode: 500,
                status: 'Error',
                errorBody: "Problem with server"
            });
        } else {
            res.status(500).json({
                statusCode: 500,
                status: 'Error',
                errorBody: error
            });
        }
        
    })
}

exports.get_recipe_by_category_and_subcategory = (req, res, next) => {
    res.status(200).json({
        statusCode: 200,
        status: 'Successfull'
    });
}

exports.get_recipe_by_ingredients = (req, res, next) => {
    res.status(200).json({
        statusCode: 200,
        status: 'Successfull'
    });
}

exports.get_recipe_by_kitchen = (req, res, next) => {
    res.status(200).json({
        statusCode: 200,
        status: 'Successfull'
    });
}

exports.get_recipe_by_tag = (req, res, next) => {
    res.status(200).json({
        statusCode: 200,
        status: 'Successfull'
    });
}

exports.get_recipe_by_tasty = (req, res, next) => {
    res.status(200).json({
        statusCode: 200,
        status: 'Successfull'
    });
}

exports.get_recipe_by_appointment = (req, res, next) => {
    res.status(200).json({
        statusCode: 200,
        status: 'Successfull'
    });
}