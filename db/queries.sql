SELECT department.department_name AS department, role.title
FROM role
LEFT JOIN department
ON role.department_id = department.id
ORDER BY department.department_name;