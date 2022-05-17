// library modules
const { query } = require("./connection");
const db = require("./connection");

// Initilize a container class for SQL querries
class dbQuerry {
  constructor(db) {
    this.db = db;
  }
  //Employee (get, add, update)
  getAllEmployees() {
    return this.db.query(`
    SELECT e.id, e.first_name, e.last_name, role.title, department.department_name, role.salary, CONCAT(m.first_name, ' ', m.last_name) manager
    FROM employee m 
    RIGHT JOIN employee e 
    ON e.manager_id = m.id 
    JOIN role ON e.role_id = role.id 
    JOIN department 
    ON department.id = role.department_id 
    ORDER BY e.id ASC;`);
  }

  // Manager (get)
  getAllManagers(){
    return this.db.query(`
    SELECT e.id, e.first_name, e.last_name, title, department_name AS department, salary, CONCAT(m.first_name, ' ',m.last_name) manager 
    FROM employee e 
    INNER JOIN role r 
    ON e.role_id = r.id 
    INNER JOIN department d 
    ON r.department_id = d.id 
    LEFT JOIN employee m 
    ON e.manager_id = m.id 
    WHERE e.id IN (SELECT e.manager_id FROM employee e LEFT JOIN employee m ON e.manager_id = m.id)
    ORDER BY e.id;`);
  }
  // Employees by manager (get)
  getEmployeesByManager(managerID){
    return this.db.query(`
    SELECT e.id, e.first_name, e.last_name, title 
    FROM employee e 
    INNER JOIN role r 
    ON e.role_id = r.id 
    INNER JOIN department d
    ON r.department_id = d.id
    LEFT JOIN employee m
    ON e.manager_id = m.id
    WHERE e.manager_id = ?;`, managerID);
  }

  //Role. (get, add)
  getAllRoles() {
    return this.db.query(`
    SELECT r.id, r.title, d.department_name AS department, r.salary
    FROM role r
    INNER JOIN department d
	ON r.department_id = d.id
	ORDER BY r.id;`);
  }

  //Department (get, add)
  getAllDepartments() {
    return this.db.query(`SELECT * FROM department ORDER BY id ASC;`);
  }

  // Combined salary of the department (get)
  getDepartmentSalary(departmentId) {
    return this.db.query(`
    SELECT d.department_name AS 'department', SUM(salary) AS 'total utilized budget'            
	FROM employee e
	INNER JOIN role r
	ON e.role_id = r.id
	INNER JOIN department d
	ON r.department_id = d.id
	WHERE r.department_id = ?;`, departmentId);
  }	
  
  // Employee (add)
  addEmployee(employee) {
    return this.db.query("INSERT INTO employee SET ?", employee);
  }

  // Department (add) 
  addDepartment(department) {
    return this.db.query("INSERT INTO department SET ?", department);
  }

  // Role (add)
  addRole(newRole) {
    return this.db.query("INSERT INTO role SET ?", newRole);
  }

  // Employee (update)
  updateEmployee() {
    return this.db.query(`
    UPDATE employee 
    SET role_id = role_id 
    WHERE first_name = name;`);
  }

  // Employee's Manager (update)
  updateEmployeeManager(manager_id, employee_id) {
    return this.db.query(`UPDATE employee SET manager_id = ? WHERE id = ?`, [manager_id, employee_id]);
  }

  // Employees's role (update)
  updateEmployeeRole(employeeId, newRoleId) {
    console.log("inside query");
    return this.db.query("UPDATE employee SET role_id = ? WHERE id = ?", [newRoleId, employeeId]);
  }

  // Employee (delete)
  removeEmployee(id) {
    return this.db.query("DELETE FROM employee WHERE ?", id);
  }

  // Role (delete)
  removeRole(id) {
    return this.db.query("DELETE FROM role WHERE ?", id);
  }

  // Department (delete)
  removeDepartment(id) {
    return this.db.query("DELETE FROM department WHERE id = ?", id);
  }
}

module.exports = new dbQuerry(db);