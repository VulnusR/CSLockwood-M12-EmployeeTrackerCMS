const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const fs = require('fs');
const schema = fs.readFileSync('./db/schema.sql', 'utf8');

//Establishes MySql DB Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'startMYSQL',
  database: 'employee_tracker'   
});


// Split the schema string into individual SQL statements
const schemaStatements = schema.split(';');


// Execute each statement in turn
schemaStatements.forEach((statement) => {
  const trimmedStatement = statement.trim();
  if (trimmedStatement) {
    connection.query(statement.trim(), (err) => {
      if (err) {
        console.error(err);
        return;
      }
  });
}
});

connection.connect(function (err) {
  if (err) throw err;
});

function graphic() {
  console.log("\n");
  console.log("                                                                                                                                                                       2023")
  console.log("___________________________________________________________________________________________________________________________________________________________________________")
  console.log("oooooooooooo                              oooo                                                 ooooooooooooo                              oooo                           ");
  console.log ("`888'     `8                              `888                                                 8'   888   `8                              `888                           ");
  console.log(" 888         ooo. .oo.  .oo.   oo.ooooo.   888   .ooooo.  oooo    ooo  .ooooo.   .ooooo.            888      oooo d8b  .oooo.    .ooooo.   888  oooo   .ooooo.  oooo d8b ");
  console.log(" 888oooo8    `888P\"Y88bP\"Y88b   888' `88b  888  d88' `88b  `88.  .8'  d88' `88b d88' `88b           888      `888\"\"8P `P  )88b  d88' `\"Y8  888 .8P'   d88' `88b `888\"\"8P ");
  console.log(" 888    \"     888   888   888   888   888  888  888   888   `88..8'   888ooo888 888ooo888           888       888      .oP\"888  888        888888.    888ooo888  888     ");
  console.log(" 888       o  888   888   888   888   888  888  888   888    `888'    888    .o 888    .o           888       888     d8(  888  888   .o8  888 `88b.  888    .o  888     ");
  console.log("o888ooooood8 o888o o888o o888o  888bod8P' o888o `Y8bod8P'     .8'     `Y8bod8P' `Y8bod8P'          o888o     d888b    `Y888\"\"8o `Y8bod8P' o888o o888o `Y8bod8P' d888b    ");
  console.log("________________________________888_______________________.o..P'___________________________________________________________________________________________________________");
  console.log("                               o888o                      `Y8P'                                                                                                          ");
  console.log("                                                                                                                                                                    VulnusR");
  console.log("\n");
  console.log("\n");
}


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
            "Update Employee Role/Manager",
            "Delete",
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
            updateEmployee()
            break;
          case "Delete":
            deleteRow();
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
      if (answer.manager_id === "") {
        answer.manager_id = null;
      }
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
      name: "employees_id",
      type: "input",
      message: "Enter the ID of the employee you want to update:",
    },
  ])
    .then((answers) => {
      if (answers.updateRole || answers.updateManager) {
        const prompts = [];
        if (answers.updateRole) {
          prompts.push({
            name: "roles_id",
            type: "input",
            message: "Enter the ID of the new role:",
          });
        }
        if (answers.updateManager) {
          prompts.push({
            name: "manager_id",
            type: "input",
            message: "Enter the ID of the new manager:",
          });
        }
        inquirer.prompt(prompts).then((answers2) => {
          const query = `UPDATE employees SET ${
            answers.updateRole && answers.updateManager
              ? "roles_id = " + answers2.roles_id + ", manager_id = " + answers2.manager_id
              : answers.updateRole
              ? "roles_id = " + answers2.roles_id
              : answers.updateManager
              ? "manager_id = " + answers2.manager_id
              : ""
          } WHERE id = ?`;
          connection.query(
            query,
            [answers.employees_id],
            (err, res) => {
              if (err) throw err;
              console.log(`${res.affectedRows} employee updated!\n`);
              startProgram();
            }
          );
        });
      } else {
        console.log("No updates selected.\n");
        startProgram();
      }
    });
};

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

    .then((answer) => {
        inquirer.prompt({
            name: "id",
            type: "input",
            message: `Enter the ID of the ${answer.table} to delete:`,
        })

        .then((answer2) => {
            const query = `DELETE FROM ${answer.table} WHERE id = ?`;
            connection.query(query, [answer2.id], (err, res) => {
                if (err) throw err;
                console.log(`${res.affectedRows} ${answer.table} deleted!\n`);
                startProgram();
            });
        });
    });
}

graphic();
startProgram();