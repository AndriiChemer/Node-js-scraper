const SELECT = require('../database/select')

exports.get_list_category_and_subcategory = (req, res, next) => {

    SELECT.selectCategory().then((jsonObject) => {

        res.status(200).json({
            statusCode: 200,
            status: 'Successfull',
            body: jsonObject
        });
    }).catch((error) => {
        handleError(error, res)    
    })
}

exports.get_categories_kitchens_tastes = (req, res, next) => {

    SELECT.getCategoryKitchenTasty()
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

function handleError(error, res) {
    if(error == -1){
        res.status(501).json({
            statusCode: 501,
            status: 'Error',
            errorBody: "Problem with server"
        });
    } else {
        console.log("Error: " + error);
        res.status(500).json({
            statusCode: 500,
            status: 'Error',
            errorBody: error
        });
    }
}