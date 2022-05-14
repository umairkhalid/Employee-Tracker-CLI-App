INSERT INTO department (department_name)
VALUES ("Service"),
       ("Finance"),
       ("Marketing"),
       ("Human Resources"),
       ("Information Technology");

INSERT INTO role (title, salary, department_id)
VALUES ("Analyst Programmer", 100000, 5),
       ('Account Executive', 100000, 2),
       ('Sr. Account Executive', 150000, 2),
       ('Sales Director', 200000, 3),
       ('HR Coordinator', 75000, 4),
       ('HR Generalist', 85000, 4),
       ('HR Director', 100000, 4),
       ('Jr. Developer', 85000, 5),
       ('Sr. Developer', 125000, 5),
       ('Programming Director', 225000, 5),
       ('IT Project Manager', 850000, 5),
       ('IT Project Director', 100000, 5),
       ('Chief Financial Officer', 275000, 2),
       ("Procurement Manager", 160000, 2),
       ("Application Support Officer", 50000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Dottie', 'O''Neil', 12, NULL),
       ('Becky', 'Houlihan', 13, 1),
       ('April', 'Romper', 14, 1),
       ('Dale', 'Robson', 3, 2),
       ('William', 'Louie', 9, 2),
       ('Carl', 'Cliffbeard', 11, 2),
       ('Jackie', 'O''Rourke', 6, 2),
       ('Bob', 'Johnson', 1, 4),
       ('Frank', 'Dodson', 1, 4),
       ('Jim', 'Bobson', 2, 4),
       ('Frankie', 'Codson', 4, 7),
       ('Bill', 'Brewer', 5, 7),
       ('Dom', 'Chewer', 5, 7),
       ('Mary', 'Bronson', 7, 5),
       ('Sarah', 'Robbie', 8, 5),
       ('Jeb', 'Johnnygriff', 10, 6),
       ('Barton', 'Heathcliffscruff', 10, 6);