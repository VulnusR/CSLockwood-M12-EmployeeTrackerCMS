const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');


//Establishes MySql DB Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_tracker'
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
            viewAll("department")
            break;
          case "View Roles":
            viewAll("role");
            break;
          case "View Employees":
            viewAll("employee");
            break;
          case "Add Department":
            add("Department");
            break;
          case "Add Role":
            add("role");
            break;
          case "Add Employee":
            add("employee");
            break;
          case "Update Employee Role":
            updateEmployee("role")
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


