const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',       // ou autre si tu as configuré différemment
  password: '',       // ton mot de passe MySQL (souvent vide en local)
  database: 'minitchat'
});

module.exports = db;
