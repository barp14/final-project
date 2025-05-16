const mysql = require('mysql2/promise');

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '932545',
  database: 'project',
  port: 3306,
});
