# Employee Tracker CLI App

![HTML](https://img.shields.io/badge/-NODE-darkgreen) ![JS](https://img.shields.io/badge/-JS-yellow) ![Node](https://img.shields.io/badge/-MySQL-brightgreen)
![JEST](https://img.shields.io/badge/-SQL-darkred) ![Inquirer](https://img.shields.io/badge/-Inquirer-pink)

![Github licence](https://img.shields.io/badge/license-MIT-blue)

## Description

This is a command-line application which allows a user to manage a database of employees within a company, using Node.js, Inquirer, and MySQL. The application connects to a database designed in MySQL which contains data for departments, roles, and employees within the company. This Content Management System allows a user to add, view, modify and delete employees' data information from company's database.

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## Walkthrough Video

The following video shows an example of the application being used from the command line: 

(PLEASE CLICK ON FOLLOWING LINK!!)

https://tyfoniacrage-x-au.wistia.com/medias/5e7e197jmx

[![A video thumbnail shows the command-line employee management application with a play button overlaying the view.](./utils/emp_tracker.gif)](https://tyfoniacrage-x-au.wistia.com/medias/5e7e197jmx)

## NPM Packages

* Following NPM packages are used in this application:

    * [Inquirer package](https://www.npmjs.com/package/inquirer).

    * [MySQL2 package](https://www.npmjs.com/package/mysql2) to connect to a MySQL database.

    * [console.table package](https://www.npmjs.com/package/console.table) to print MySQL rows to the console.

- - -
© 2022 Umair Khalid. Confidential and Proprietary. All Rights Reserved.
