CREATE DATABASE IF NOT EXISTS cookmaster;

USE cookmaster;

CREATE TABLE user (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(30) NOT NULL,
    password VARCHAR(30) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL
);