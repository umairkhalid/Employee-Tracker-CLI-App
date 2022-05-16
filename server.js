// Import and require library modules
const inquirer = require('inquirer');
const db = require('./config/querries');
const connection = require('./config/connection');
const { getAllEmployees } = require('./config/querries');
require('console.table');

const init = () => {
  inquirer.prompt([
    {
      name: 'inquiry',
      type: 'list',
      message: 'Welcome to the employee management program. What would you like to do?',
      choices: [
        'View all departments', 
        'View all roles', 
        'View all employees', 
        'View all employees by manager', 
        'Add a department', 
        'Add a role', 
        'Add an employee', 
        'Update employee\'s role', 
        'Update employee\'s manager', 
        'Remove a department', 
        'Remove a role', 
        'Remove an employee', 
        'View total salary of department', 
        'Exit program'
      ]
    }
  ]).then((response) => {
    switch (response.inquiry) {
      case 'View all departments':
          viewAllDepartments();    
          break;
      case 'View all roles':
          viewAllRoles();
          break;
      case 'View all employees':
          viewAllEmployees();
          break;
      case 'View all employees by manager':
          viewAllEmployeesByManager();
      break;
      case 'Add a department':
          addADepartment();
      break;
      case 'Add a role':
          addARole();
      break;
      case 'Add an employee':
          addAnEmployee();
      break;
      case 'Update employee\'s role':
          updateEmployeeRole();
      break;
      case 'Update employee\'s manager':
          updateEmployeesManager();
      break;
      case 'Remove a department':
          removeADepartment();
      break;
      case 'Remove a role':
          removeARole();
      break;
      case 'Remove an employee':
          removeAnEmployee();
      break;
      case 'View total salary of department':
          viewDepartmentSalary();
      break;
      case 'Exit program':
          connection.end();
          console.log('\n Thanks for using Employee tracker App!! \n');
          return;
      default:
          break;
    }
  })
}

let viewAllDepartments = async () => {
  const departments = await db.getAllDepartments();
      console.table('\n', departments);
      init();
};

let viewAllRoles = async () => {
  const role = await db.getAllRoles();
      console.table('\n', role);
      init();
};

let viewAllEmployees = async () => {
  const employees = await db.getAllEmployees();
      console.table('\n', employees);
      init();
};

let viewAllEmployeesByManager = async () => {
  const mObjects = await db.getAllManagers();
  // map manager names
  const mNames = mObjects.map((m) => m.first_name + ' ' + m.last_name);

  //* inquirer	> ask the user to choose the manager for which to print the employees
  const { managerName } = await inquirer.prompt([
    {
    name: 'managerName',
    type: 'list',
    message: 'Which manager would you like to see the employee\'s of?',
    choices: mNames   
    },
  ]);
  
  // find manager object with manager name
  const { id: managerId } = mObjects.find((m) => m.first_name + ' ' + m.last_name === managerName);

  //* mysql 	> get the employees with that specific manager from the database
  const eObjects = await db.getEmployeesByManager(managerId);

  // log view title
  console.log(`\nTable: ${managerName}'s team`);

  // log view
  console.table('\n', eObjects);
  init();

  // connection.query(`SELECT employee_id, first_name, last_name FROM employee ORDER BY employee_id ASC;`, (err, res) => {
  //     if (err) throw err;
  //     let managers = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
  //     inquirer.prompt([
  //         {
  //         name: 'manager',
  //         type: 'list',
  //         message: 'Which manager would you like to see the employee\'s of?',
  //         choices: managers   
  //         },
  //     ]).then((response) => {
  //         connection.query(`SELECT e.employee_id, e.first_name, e.last_name, role.title, department.department_name, role.salary, CONCAT(m.first_name, ' ', m.last_name) manager FROM employee m RIGHT JOIN employee e ON e.manager_id = m.employee_id JOIN role ON e.role_id = role.role_id JOIN department ON department.department_id = role.department_id WHERE e.manager_id = ${response.manager} ORDER BY e.employee_id ASC`, 
  //         (err, res) => {
  //             if (err) throw err;
  //             console.table('\n', res, '\n');
  //             init();
  //         })
  //     })
  // })
}

let addADepartment = async () => {
  const department_name = await inquirer.prompt([
    {
      name: 'department_name',
      type: 'input',
      message: 'What is the name of the department you want to add?'   
    }
  ]);
  const resolve = await db.addDepartment(department_name);
  console.log("\n" + resolve + "successfully added to database! \n");
  init();
};

let addARole = async () => {
  const departments = await db.getAllDepartments();
  const departmentsList = departments.map(({ id, title }) => ({ name: title, value: id }));

  const roleToAdd = await inquirer.prompt([
    {
      name: 'title',
      type: 'input',
      message: 'What is the name of the role you want to add?'   
    },
    {
      name: 'salary',
      type: 'input',
      message: 'What is the salary of the role you want to add?'   
    },
    {
      name: 'department_id',
      type: 'list',
      message: 'Which department do you want to add the new role to?',
      choices: departmentsList
    },
  ]);

  await db.addRole(roleToAdd);
  init();
};

let addAnEmployee = async () => {
  const rolesOptions = await db.getAllRoles();
  const managerOptions = await db.getAllEmployees();
  
  const employeeToAdd = await inquirer.prompt([
    {
      name: 'first_Name',
      type: 'input',
      message: 'What is the new employee\'s first name?'
    },
    {
      name: 'last_Name',
      type: 'input',
      message: 'What is the new employee\'s last name?'
    },
  ]);

  var roleChoicesList = rolesOptions.map(({ id, title }) => ({ name: title, value: id }));
  const {roleId} = await inquirer.prompt(
    {
      name: 'roleId',
      type: 'list',
      message: 'What is the new employee\'s title?',
      choices: roleChoicesList
    }
  );

  const managerChoicesList = managerOptions.map(({ first_name, last_name, id }) => ({ name: first_name + ' ' + last_name, value: id }));
  if (managerChoicesList && managerChoicesList.length > 0)
  {
    const {managerId} = await inquirer.prompt(
      {
        name: 'managerId',
        type: 'list',
        message: 'Who is the new employee\'s manager?',
        choices: managerChoicesList
      }
    );

    employeeToAdd.manager_id = managerId;
  }

  employeeToAdd.role_id = roleId;
  await db.addEmployee(employeeToAdd);

  init();

};

let updateEmployeeRole = async () => {
  const employeeOptions = await db.getAllEmployees();

  const rolesOptions = await db.getAllRoles();

  const employeeOptionsToChooseFrom = employeeOptions.map(({ id, first_name, last_name }) => ({
    name: first_name + ' ' + last_name,
    value: id,
  }));

  const rolesOptionsToChooseFrom = rolesOptions.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const { employeeId } = await inquirer.prompt([

    {
      name: 'employeeId',
      type: 'list',
      message: 'Which employee would you like to update the role for?',
      choices: employeeOptionsToChooseFrom
    },
  ]);

  const { roleId } = await inquirer.prompt([
    {
      name: 'roleId',
      type: 'list',
      message: 'What should the employee\'s new role be?',
      choices: rolesOptionsToChooseFrom
    },
  ]);

  await db.updateEmployeeRole(employeeId, roleId);
  console.log(`\n Successfully updated employee's role in the database! \n`);
  init();
};

let updateEmployeesManager = async () => {
  const employeeOptions = await db.getAllEmployees();

  // map employee names
  const employeeChoicesList = employeeOptions.map((e) => e.first_name + ' ' + e.last_name);

  const { employeeId } = await inquirer.prompt([
    {
      name: 'employeeId',
      type: 'list',
      message: 'Which employee would you like to update the manager for?',
      choices: employeeChoicesList
    },
  ]);

  // map manager names
  const managerChoicesList = employeeOptions.map((m) => m.first_name + ' ' + m.last_name);

  const { managerId } = await inquirer.prompt([
    {
      name: 'managerId',
      type: 'list',
      message: 'Who should the employee\'s new manager be?',
      choices: managerChoicesList
    },
  ]);

  //* mysql 	> update the employee's manager in the database
  const resolveMsg = await db.updateEmployeeManager(managerId, employeeId);
  
  // log result
  console.log(`\n Successfully updated employee's manager in the database! \n`);
  init();
    
  //employeeId.manager_id = managerId;
  //employeeId.id = employeeId;

  // db.query(`SELECT * FROM employee;`, (err, res) => {
  //     if (err) throw err;
  //     let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
  //     inquirer.prompt([
  //         {
  //             name: 'employee',
  //             type: 'rawlist',
  //             message: 'Which employee would you like to update the manager for?',
  //             choices: employees
  //         },
  //         {
  //             name: 'newManager',
  //             type: 'rawlist',
  //             message: 'Who should the employee\'s new manager be?',
  //             choices: employees
  //         },
  //     ]).then((response) => {
  //         db.query(`UPDATE employee SET ? WHERE ?`, 
  //         [
  //             {
  //                 manager_id: response.newManager,
  //             },
  //             {
  //                 employee_id: response.employee,
  //             },
  //         ], 
  //         (err, res) => {
  //             if (err) throw err;
  //             console.log(`\n Successfully updated employee's manager in the database! \n`);
  //             init();
  //         })
  //     })
  // })
};

let removeADepartment = async () => {
  const departmentOptions = await db.getAllDepartments();

  const departmentOptionsToChooseFrom = departmentOptions.map(e => ({name: e.department_name, value: e.id }));

  const { departmentId } = await inquirer.prompt([
    {
      name: 'departmentId',
      type: 'list',
      message: 'Which department would you like to remove?',
      choices: departmentOptionsToChooseFrom
    },
  ]);

  await db.removeDepartment(departmentId);
  console.log(`\n Successfully removed the ${departmentId} from the database! \n`);
  init();
};

let removeARole = async () => {
  const rolesOptions = await db.getAllRoles();

  const roleChoicesList = rolesOptions.map(role => ({name: role.title, value: role.id }));

  const roleId = await inquirer.prompt([
    {
      name: 'roleId',
      type: 'rawlist',
      message: 'Which role would you like to remove?',
      choices: roleChoicesList
    },
  ]);

  await db.removeRole(roleId);
  console.log(`\n Successfully removed the ${roleId} from roles! \n`);
  init();

  // db.query(`SELECT * FROM role ORDER BY role_id ASC;`, (err, res) => {
  //     if (err) throw err;
  //     let roles = res.map(role => ({name: role.title, value: role.role_id }));
  //     inquirer.prompt([
  //         {
  //         name: 'title',
  //         type: 'rawlist',
  //         message: 'Which role would you like to remove?',
  //         choices: roles
  //         },
  //     ]).then((response) => {
  //         db.query(`DELETE FROM role WHERE ?`, 
  //         [
  //             {
  //                 role_id: response.title,
  //             },
  //         ], 
  //         (err, res) => {
  //             if (err) throw err;
  //             console.log(`\n Successfully removed the role from the database! \n`);
  //             init();
  //         })
  //     })
  // })
};

let removeAnEmployee = async () => {
  const employeeOptions = await db.getAllEmployees();

  const employeeChoicesList = employeeOptions.map(({ id, first_name, last_name }) => ({
    name: first_name + ' ' + last_name,
    value: id,
  }));

  const id =  await inquirer.prompt([
    {
        name: 'id',
        type: 'list',
        message: 'Which employee would you like to remove?',
        choices: employeeChoicesList
    },
  ]);

  await db.removeEmployee(id);
  console.log('\n', id, 'has been removed!');
  init();

  // db.query(`SELECT * FROM employee ORDER BY employee_id ASC;`, (err, res) => {
  //     if (err) throw err;
  //     let employees = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.employee_id }));
  //     inquirer.prompt([
  //         {
  //             name: 'employee',
  //             type: 'rawlist',
  //             message: 'Which employee would you like to remove?',
  //             choices: employees
  //         },
  //     ]).then((response) => {
  //         db.query(`DELETE FROM employee WHERE ?`, 
  //         [
  //             {
  //                 employee_id: response.employee,
  //             },
  //         ], 
  //         (err, res) => {
  //             if (err) throw err;
  //             console.log(`\n Successfully removed the employee from the database! \n`);
  //             init();
  //         })
  //     })
  // })
}

let viewDepartmentSalary = async () => {
  const departmentOptions = await db.getAllDepartments();

  const departmentsList = departmentOptions.map(department => ({name: department.department_name, value: department.id }));

  const { departmentName } = await inquirer.prompt([
    {
      name: 'departmentName',
      type: 'list',
      message: 'Which department would you like to view the total salaries of?',
      choices: departmentsList
    },
  ]);

  const budget = await db.getDepartmentSalary(departmentName);
  console.log(`\n The total utilized salary budget of the this department is: \n`);
  console.table(budget);
  init();

  // db.query(`SELECT * FROM department ORDER BY department_id ASC;`, (err, res) => {
  //     if (err) throw err;
  //     let departments = res.map(department => ({name: department.department_name, value: department.department_id }));
  //     inquirer.prompt([
  //         {
  //         name: 'deptName',
  //         type: 'rawlist',
  //         message: 'Which department would you like to view the total salaries of?',
  //         choices: departments
  //         },
  //     ]).then((response) => {
  //         db.query(`SELECT department_id, SUM(role.salary) AS total_salary FROM role WHERE ?`, 
  //         [
  //             {
  //                 department_id: response.deptName,
  //             },
  //         ], 
  //         (err, res) => {
  //             if (err) throw err;
  //             console.log(`\n The total utilized salary budget of the ${response.deptName} department is $ \n`);
  //             console.table('\n', res, '\n');
  //             init();
  //         })
  //     })
  // })
}

init();
