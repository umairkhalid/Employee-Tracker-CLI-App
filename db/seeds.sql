INSERT INTO department (department_name)
VALUES ("Service"),
       ("Finance"),
       ("Marketing"),
       ("Human Resources"),
       ("Information Technology");

INSERT INTO role (title, salary, department_id)
VALUES ("Analyst Programmer", 100000, 5),
       ("Procurement Manager", 160000, 2),
       ("Application Support Officer", 50000, 1),
       ("Recruitment Officer", 70000, 4),
       ("Sales Manager", 80000, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Murtaza", "Rahim", 3),
       ("Umair", "Khalid", 5),
       ("Safdar", "Sheikh", 1),
       ("Imran", "Shafi", 2),
       ("Sally", "O'Brien", 4);
