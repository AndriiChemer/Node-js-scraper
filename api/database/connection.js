const mysql = require('mysql')

var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'andrii',
    password : '31lanafe',
    database : 'recipe',
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

module.exports = connection;