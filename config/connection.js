const mysql = require('mysql2');
const util = require("util"); 
require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
    {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    console.log(`Connected to the office_db database.`)
);

db.connect(err => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
});

db.query = util.promisify(db.query); 

module.exports = db;