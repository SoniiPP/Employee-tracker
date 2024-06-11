-- Drop the database if it exists to start fresh
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

-- Connect to the newly created database
\c employees_db;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS emp_role;
DROP TABLE IF EXISTS department;

-- Create the department table
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- Create the role table
CREATE TABLE emp_role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

-- Create the employee table
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES emp_role(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);
