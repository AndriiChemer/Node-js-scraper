const SELECT = require('../database/select')

exports.get_list_category_and_subcategory = (req, res, next) => {

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

exports.get_categories_kitchens_tastes = (req, res, next) => {

    SELECT.getMultipleCategory()
    .then((jsonObject) => {
        res.status(200).json({
            statusCode: 200,
            status: 'Successfull',
            body: jsonObject
        });
    })
    .catch((error) => {
        handleError(error, res)
    })

}