// Import and require library modules
const db = require('./config/connection');
require('console.table');

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
SELECT a.id, a.first_name, a.last_name, role.title, role.department_name AS department, role.salary, concat(b.first_name,' ',b.last_name) AS manager 
FROM employee a 
LEFT JOIN employee b 
ON a.manager_id = b.id 
JOIN (SELECT role.id, role.title, role.salary, department.department_name 
      FROM role JOIN department 
      ON department.id = role.department_id) role 
      ON role.id = a.role_id;`;

db.query(sql, (err, results) => {
    console.table(results);
});
