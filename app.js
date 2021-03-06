const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mysql = require('mysql')

var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'andrii',
    password : '31lanafe',
    database : 'sys',
});

connection.connect(function(err) {
    // in case of error
    if(err){
        console.log('Database connect failure!');
        console.log('error: ' + err.stack);
        console.log(err.code);
    } else {
        console.log('Database has been connected successfully!');
    }
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE', 'GET');
        return res.status(200).json({});
    }
    next();
});

app.use(express.static(__dirname + '/api/images'))


const recipeRoutes = require('./api/routes/recipeRoute')
const categoryRoutes = require('./api/routes/categoryRoute')
const ingredientRoutes = require('./api/routes/indredientRoute')
const imageRoutes = require('./api/routes/imageRoute.js')
// const freebooksRoutes = require('./api/routes/freebooks')

app.use('/recipes', recipeRoutes);
app.use('/categories', categoryRoutes);
app.use('/ingredients', ingredientRoutes);
app.use('/images', imageRoutes);


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            status: error.status
        }
    });
});

module.exports = app;