const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '135.125.95.178',
    user: 'ludo',
    password: "@C-UYa<6f\@jWyJ'",
    database: 'cyberbibli',
});

connection.connect();

module.exports = connection;