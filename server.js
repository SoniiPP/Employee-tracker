const inquirer = require("inquirer");
const figlet = require("figlet");
const consoleTable = require('console.table');
const { Pool } = require('pg');
// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "emptrack_db",
  password: "postgre",
  port: 5432,
});

pool.connect(err => {
  if (err) throw err;
  console.log("Connected to the database!");
  figlet('Employee Manager', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(data);
    startQuestion();
  });
});

function startQuestion() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'intro',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'Add Employee',
        'Update Employee Role',
        'View All Roles',
        'Add Role',
        'View All Departments',
        'Add Department',
        'Quit'
      ]
    }
  ]).then(answer => {
    switch (answer.intro) {
      case 'View All Employees':
        viewEmployees();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        updateRole();
        break;
      case 'View All Roles':
        viewRoles();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'View All Departments':
        viewDepartments();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Quit':
        console.log('Good-Bye!');
        pool.end();
        break;
    }
  });
}

// Viewing
function viewDepartments() {
  const sql = `SELECT department.id, department.name AS Department FROM department;`
  pool.query(sql, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(res.rows);
    startQuestion();
  });
}

function viewRoles() {
  const sql = `SELECT role.id, role.title AS role, role.salary, department.name AS department 
               FROM role 
               INNER JOIN department ON (department.id = role.department_id);`;
  pool.query(sql, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(res.rows);
    startQuestion();
  });
}

function viewEmployees() {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, 
               department.name AS department, role.salary, 
               CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
               FROM employee 
               LEFT JOIN employee manager on manager.id = employee.manager_id 
               INNER JOIN role ON (role.id = employee.role_id) 
               INNER JOIN department ON (department.id = role.department_id) 
               ORDER BY employee.id;`
  pool.query(sql, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(res.rows);
    startQuestion();
  });
}

// Adding
function addDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'department',
      message: 'What is the name of the department?',
    }
  ]).then(answer => {
    const sql = `INSERT INTO department(name) VALUES($1);`
    pool.query(sql, [answer.department], (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`Added ${answer.department} to the database`);
      startQuestion();
    });
  });
}

function addRole() {
  const sql2 = `SELECT * FROM department`;
  pool.query(sql2, (error, response) => {
    if (error) {
      console.log(error);
      return;
    }
    const departmentList = response.rows.map(department => ({
      name: department.name,
      value: department.id
    }));
    inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the name of the role?',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?',
      },
      {
        type: 'list',
        name: 'department',
        message: 'Which Department does the role belong to?',
        choices: departmentList
      }
    ]).then(answers => {
      const sql = `INSERT INTO role(title, salary, department_id) VALUES($1, $2, $3);`
      pool.query(sql, [answers.title, answers.salary, answers.department], (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(`Added ${answers.title} to the database`);
        startQuestion();
      });
    });
  });
}

function addEmployee() {
  const sql2 = `SELECT * FROM employee`;
  pool.query(sql2, (error, response) => {
    if (error) {
      console.log(error);
      return;
    }
    const employeeList = response.rows.map(employee => ({
      name: employee.first_name.concat(" ", employee.last_name),
      value: employee.id
    }));

    const sql3 = `SELECT * FROM role`;
    pool.query(sql3, (error, response) => {
      if (error) {
        console.log(error);
        return;
      }
      const roleList = response.rows.map(role => ({
        name: role.title,
        value: role.id
      }));
      inquirer.prompt([
        {
          type: 'input',
          name: 'first',
          message: "What is the employee's first name?",
        },
        {
          type: 'input',
          name: 'last',
          message: "What is the employee's last name?",
        },
        {
          type: 'list',
          name: 'role',
          message: "What is the employee's role?",
          choices: roleList
        },
        {
          type: 'list',
          name: 'manager',
          message: "Who is the employee's manager?",
          choices: employeeList
        }
      ]).then(answers => {
        const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id) 
                     VALUES($1, $2, $3, $4);`
        pool.query(sql, [answers.first, answers.last, answers.role, answers.manager], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log(`Added ${answers.first} ${answers.last} to the database`);
          startQuestion();
        });
      });
    });
  });
}

// Updating
function updateRole() {
  const sql2 = `SELECT * FROM employee`;
  pool.query(sql2, (error, response) => {
    if (error) {
      console.log(error);
      return;
    }
    const employeeList = response.rows.map(employee => ({
      name: employee.first_name.concat(" ", employee.last_name),
      value: employee.id
    }));
    const sql3 = `SELECT * FROM role`;
    pool.query(sql3, (error, response) => {
      if (error) {
        console.log(error);
        return;
      }
      const roleList = response.rows.map(role => ({
        name: role.title,
        value: role.id
      }));
      inquirer.prompt([
        {
          type: 'list',
          name: 'employee',
          message: "Which employee's role do you want to update?",
          choices: employeeList
        },
        {
          type: 'list',
          name: 'role',
          message: "Which role do you want to assign the selected employee?",
          choices: roleList
        },
        {
          type: 'list',
          name: 'manager',
          message: "Who will be this employee's manager?",
          choices: employeeList
        }
      ]).then(answers => {
        const sql = `UPDATE employee SET role_id = $1, manager_id = $2 WHERE id = $3;`
        pool.query(sql, [answers.role, answers.manager, answers.employee], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("Employee role updated");
          startQuestion();
        });
      });
    });
  });
}

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

module.exports = {
  query: (text, params) => pool.query(text, params),
};
