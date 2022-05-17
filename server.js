// Import and require library modules
const inquirer = require('inquirer');
const db = require('./config/querries');
const connection = require('./config/connection');
require('console.table');

// Initialize the menu items
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

// function to print all employees in the database
const viewAllDepartments = async () => {
  try {
    const departments = await db.getAllDepartments();
    console.table('\n', departments);
    init();
  } catch (err) {
    // error handling
    console.error(err);
  }
};

const viewAllRoles = async () => {
  try {
    const role = await db.getAllRoles();
    console.table('\n', role);
    init();
  } catch (err) {
    // error handling
    console.error(err);
  }
};

const viewAllEmployees = async () => {
  try {
    const employees = await db.getAllEmployees();
    console.table('\n', employees);
    init();
  } catch (err) {
    // error handling
    console.error(err);
  }
};

const viewAllEmployeesByManager = async () => {
  try {
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
    console.log(`\n ${managerName}'s team \n`);
  
    // log view
    console.table(eObjects);
    init();  
  } catch (err) {
    // error handling
    console.error(err);
  }
}

const addADepartment = async () => {
  try {
    const department_name = await inquirer.prompt([
      {
        name: 'department_name',
        type: 'input',
        message: 'What is the name of the department you want to add?'   
      }
    ]);
    await db.addDepartment(department_name);
    console.log(`\n Department has been added to the database successfully! \n`);
    init();
  } catch (err) {
    // error handling
    console.error(err);
  }
};

const addARole = async () => {
  try {
    const departments = await db.getAllDepartments();
    const departmentsList = departments.map(({ id, department_name }) => ({ 
      name: department_name, 
      value: id 
    }));
  
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
    console.log(`\n Role has been added to the database successfully! \n`);
    init();
  } catch (err) {
    // error handling
    console.error(err);
  }
};

const addAnEmployee = async () => {
  try {
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
  
    const roleChoicesList = rolesOptions.map(({ id, title }) => ({ name: title, value: id }));
    const {role_Id} = await inquirer.prompt(
      {
        name: 'role_Id',
        type: 'list',
        message: 'What is the new employee\'s title?',
        choices: roleChoicesList
      }
    );
  
    employeeToAdd.role_id = role_Id;
  
    const managerChoicesList = managerOptions.map(({ first_name, last_name, id }) => ({ name: first_name + ' ' + last_name, value: id }));
    if (managerChoicesList && managerChoicesList.length > 0)
    {
      const {manager_Id} = await inquirer.prompt(
        {
          name: 'manager_Id',
          type: 'list',
          message: 'Who is the new employee\'s manager?',
          choices: managerChoicesList.length === 0 ? ['none'] : [...managerChoicesList, 'none'],
        }
      );
      if (manager_Id === 'none') {
        employeeToAdd.manager_id = null;
      } else {
        employeeToAdd.manager_id = manager_Id;
      }  
    }
    await db.addEmployee(employeeToAdd);
    console.log('\n', employeeToAdd, 'has been added to employees! \n')
    init();
  } catch (err) {
    // error handling
    console.error(err);
  }
};

const updateEmployeeRole = async () => {
  try {
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
  } catch (err) {
    // error handling
    console.error(err);
  }
};

const updateEmployeesManager = async () => {
  try {
    const employeeOptions = await db.getAllEmployees();

    // map employee names
    const employeeChoicesList = employeeOptions.map(({ id, first_name, last_name }) => ({
      name: first_name + ' ' + last_name,
      value: id,
    }));
  
    const { employeeId } = await inquirer.prompt([
      {
        name: 'employeeId',
        type: 'list',
        message: 'Which employee would you like to update the manager for?',
        choices: employeeChoicesList
      },
    ]);
  
    // map manager names
    const managerChoicesList = employeeOptions.map(({ id, first_name, last_name }) => ({
      name: first_name + ' ' + last_name,
      value: id,
    }));
  
    const { managerId } = await inquirer.prompt([
      {
        name: 'managerId',
        type: 'list',
        message: 'Who should the employee\'s new manager be?',
        choices: managerChoicesList
      },
    ]);
  
    //* mysql 	> update the employee's manager in the database
    await db.updateEmployeeManager(managerId, employeeId);
    
    // log result
    console.log(`\n Successfully updated employee's manager in the database! \n`);
    init();
  } catch (err) {
    // error handling
    console.error(err);
  }
};

const removeADepartment = async () => {
  try {
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
  
    db.removeDepartment(departmentId);
    console.log(`\n Department has been removed from the database successfully! \n`);
    init();
  } catch (err) {
    // error handling
    console.error(err);
  }  
};

const removeARole = async () => {
  try {
    const rolesOptions = await db.getAllRoles();

    const roleChoicesList = rolesOptions.map(({ id, title }) => ({
      name: title,
      value: id,
    }));
  
    const id = await inquirer.prompt([
      {
        name: 'id',
        type: 'rawlist',
        message: 'Which role would you like to remove?',
        choices: roleChoicesList
      },
    ]);
  
    await db.removeRole(id);
    console.log(`\n Role has been removed from the database successfully! \n`);
    init();
  } catch (err) {
    // error handling
    console.error(err);
  }
};

const removeAnEmployee = async () => {
  try {
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
    console.log('\n', id, 'has been removed! \n');
    init();
  } catch (err) {
    // error handling
    console.error(err);
  }
};

const viewDepartmentSalary = async () => {
  try {
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
    console.log(`\n The total utilized salary budget of this department is: \n`);
    console.table(budget);
    init();
  } catch (err) {
    // error handling
    console.error(err);
  }
};

init();
