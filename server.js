// Import and require library modules
const express = require('express');
const db = require('./config/connection');
require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Query database
db.query('SELECT * FROM department', function (err, results) {
    console.log(results);
  });

// Query database
db.query('SELECT * FROM role', function (err, results) {
    console.log(results);
  });

// Query database
const sql = `
SELECT department.id, department.department_name AS department, role.title
FROM role
LEFT JOIN department
ON role.department_id = department.id
ORDER BY department.id;`;
db.query(sql, (err, results) => {
    console.table(results);
  });

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
