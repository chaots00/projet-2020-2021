const mysql = require('mysql');
const connection = mysql.createConnection({
    host: '51.91.208.24',
    user: '',
    password: '',
    database: 'cyberbibli',
});

connection.connect();

module.exports = connection;