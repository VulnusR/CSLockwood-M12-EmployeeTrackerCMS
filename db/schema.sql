/*
INT(X) -Specifies the length of the ID
UNSIGNED -Specifies the field should contain only positive integers
ZEROFILL -Specifies the ID should be 0 padded to the left
AUTO_INCREMENT -IS used in conjuction w/ primary key, incrementing each id to ensure that each ID is unique
*/

CREATE TABLE departments (
  id INT(5) UNSIGNED ZEROFILL AUTO_INCREMENT PRIMARY KEY
  name VARCHAR(30) NOT NULL
);



