//node modules
var mysql = require('mysql');

//sql connection
module.exports = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Youme234",
    database: "zombie"
});
