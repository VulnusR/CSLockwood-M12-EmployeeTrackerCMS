const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');


//Establishes MySql DB Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_tracker',
    port: 3306
});


// Start Program Function to return various options
const startProgram = () => {
    return inquirer.prompt ({
        type: "list",
        name: "start-menu",
        message: "Select an option:",
        choices: [
            "View Deparments",
            "View Roles",
            "View Employees",
            "View Employees by Department",
            "View Employees by Manager",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update Eployee Role",
            "Quit"
        ]
    })

    //selector switch
    .then((answer) => {
        switch (answer['start-menu']) {
          case "View Deparments":
            viewAll("departments")
            break;
          case "View Roles":
            viewAll("roles");
            break;
          case "View Employees":
            viewAll("employees");
            break;
          case "View Employees by Department":
            viewEmployeesByDepartment();
            break;
          case "View Employees by Manager":
            viewEmployeesByManager();
            break;
          case "Add Department":
            add("departments");
            break;
          case "Add Role":
            add("roles");
            break;
          case "Add Employee":
            add("employees");
            break;
          case "Update Employee Role/Manager":
            updateEmployee("employees")
            break;
          case "Quit":
            connection.end();
            break;
          default:
            console.log(`Invalid option: ${answer['start-menu']}`);
            break;
        }
    })
}


//takes table name as argument to run function for selector switch of startProgram view department -> view employees
const viewAll = (table) => {
  const query = `SELECT * FROM ${table}`;
  connection.query(query, (err, results) => {
    if (err) throw err;
    console.log(cTable.getTable(results));
    startProgram();
  });
};


//takes table name as argument to run function for selector switch of startProgram add department -> add employee
const add = (table) => {
    let prompts = [];
    let insertQuery;

    if (table === "departments") {
        prompts = [
           {
                type: "input",
                name: "name",
                message: "Enter department name:",
           },
        ];
        // INSERT INTO - specifies which table to insert data into
        //SET ? - SET keyword denotes the values that should be inserted into the data base, while ? serves as place holder for the data.
        insertQuery = "INSERT INTO departments SET ?";
    }

    else if (table === "roles") {
        prompts = [
            {
                type: "input",
                name: "title",
                message: "Enter role title:",
            },

            {
                type: "input",
                name: "salary",
                message: "Enter role salary:",
            },

            {
                type: "input",
                name: "departments_id",
                message: "Enter department ID:",
            },
        ];
        insertQuery = "INSERT INTO roles SET ?";
    }

    else if (table === "employees") {
        prompts = [
            {
                type: "input",
                name: "first_name",
                message: "Enter employee first name:",
              },

              {
                type: "input",
                name: "last_name",
                message: "Enter employee last name:",
              },

              {
                type: "input",
                name: "roles_id",
                message: "Enter role ID:",
              },

              {
                type: "input",
                name: "manager_id",
                message: "Enter manager ID:",
              },
        ];
        insertQuery = "INSERT INTO employees SET ?";
    }
  
    //adds new row to table in DB from input.
    inquirer.prompt(prompts).then((answer) => {
        connection.query(insertQuery, answer, (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} ${table} added!\n`);
            startProgram();
        });
    });
};



//Allows users to select if they want to update and/or manager
const updateEmployee = () => {
    inquirer.prompt([
        {
          type: "confirm",
          name: "updateRole",
          message: "Would you like to update the employee's role?",
        },
        {
          type: "confirm",
          name: "updateManager",
          message: "Would you like to update the employee's manager?",
        },
        {
          name: "employees_Id",
          type: "input",
          message: "Enter the ID of the employee you want to update:",
        },
    ])

    .then((answers) => {
        if (answers.updateRole) {
            // Prompt for new role ID and update employee's role
            inquirer.prompt([
                {
                    name: "roles_id",
                    type: "input",
                    message: "Enter the ID of the new role:",
                },
            ])
          
            .then((answer) => {
                const query = `UPDATE employees SET roles_id = ? WHERE id = ?`;
                connection.query(query, [answer.roles_id, answers.employees_id], (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} employee updated!\n`);
                    startProgram();
                });
            });
        }
        
        if (answers.updateManager) {
            // Prompt for new manager ID and update employee's manager
            inquirer.prompt([
                {
                    name: "manager_id",
                    type: "input",
                    message: "Enter the ID of the new manager:",
                },
            ])
            
            .then((answer) => {
                const query = `UPDATE employees SET manager_id = ? WHERE id = ?`;
                connection.query(query, [answer.manager_id, answers.employees_id], (err, res) => {
                    if (err) throw err;
                    console.log(`${res.affectedRows} employee updated!\n`);
                    startProgram();
                });
            });
        }
    });
}

const viewEmployeesByManager = () => {
    const query = `
        SELECT CONCAT(m.first_name, ' ', m.last_name) AS manager, 
        e.id, 
        CONCAT(e.first_name, ' ', e.last_name) AS name, 
        r.title, 
        d.name AS departments, 
        r.salary, 
        CONCAT(m2.first_name, ' ', m2.last_name) AS reports_to
        FROM employees e
        JOIN roles r ON e.roles_id = r.id
        JOIN departments d ON r.departments_id = d.id
        JOIN employees m ON e.manager_id = m.id
        LEFT JOIN employees m2 ON e.manager_id = m2.id
        ORDER BY manager
    `;

    connection.query(query, (err, results) => {
        if (err) throw err;

        console.log(cTable.getTable(results));
        startProgram();
    });
};

const viewEmployeesByDepartment = () => {
    const query = ` 
        SELECT d.name AS departments, 
        CONCAT(e.first_name, ' ', e.last_name) AS name, 
        r.title, 
        r.salary, 
        CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employees e
        JOIN roles r ON e.roles_id = r.id
        JOIN departments d ON r.departments_id = d.id
        LEFT JOIN employees m ON e.manager_id = m.id
        ORDER BY departments
    `;

    connection.query(query, (err, results) => {
        if (err) throw err;

        console.log(cTable.getTable(results));
        startProgram();
    });
};

const deleteRow = () => {
    inquirer.prompt({
        name: "table",
        type: "list",
        message: "Select a class you want to delete from:",
        choices: ["departments", "roles", "employees"],
    })
}


