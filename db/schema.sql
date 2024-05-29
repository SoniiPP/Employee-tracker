DROP DATABASE IF EXISTS department;
DROP DATABASE IF EXISTS emply_role;
DROP DATABASE IF EXISTS employee;

CREATE DATABASE department(
id: Serial primary key
name: VARCHAR(30) UNIQUE NOT NULL

);
CREATE DATABASE emply_role(

id: SERIAL PRIMARY key
tile: VARCHAR(30) UNIQUE NOT NULL
salary: DECIMAL NOT NULL
department_id: INTEGER NOT NULL 

);
CREATE DATABASE employee(
    id: SERIAL PRIMARY KEY 
    first_name: VARCHAR(30) NOT NULL
    last_name: VARCHAR(30) NOT NULL
    role_id: INTEGER NOT NULL
    manager_id: INTEGER

);

