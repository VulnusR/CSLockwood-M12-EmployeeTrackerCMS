
/*
INT(X) -Specifies the length of the ID
UNSIGNED -Specifies the field should contain only positive integers
ZEROFILL -Specifies the ID should be 0 padded to the left
AUTO_INCREMENT -IS used in conjuction w/ primary key, incrementing each id to ensure that each ID is unique
*/

CREATE TABLE IF NOT EXISTS departments (
  id INT(5) UNSIGNED ZEROFILL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

/*
decimal(X,Y) - x denotes numbers to the left of the decimal, y denotes numbers to the right
FOREIGN KEY - A constraint that ensures data integrity via creating an id link between the key & reference
*/

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  departments_id INT(5) UNSIGNED ZEROFILL,
  FOREIGN KEY (departments_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS employees (
  id INT(10) UNSIGNED ZEROFILL AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  roles_id INT,
  manager_id INT UNSIGNED NULL DEFAULT NULL,
  FOREIGN KEY (roles_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);