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
            viewAll("departments")
            break;
          case "View Roles":
            viewAll("roles");
            break;
          case "View Employees":
            viewAll("employees");
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
          case "Update Employee Role":
            updateEmployee("roles")
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
    console.table(results);
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
  





  .then((answer) => {
    const query = `INSERT INTO ${table} SET ?`;
    connection.query(query, answer, (err, res) => {
      if (err) throw err;
      console.log(`${res.affectedRows} ${table} added!\n`);
      startProgram();
    });
  });
};


