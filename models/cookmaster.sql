CREATE DATABASE IF NOT EXISTS cookmaster;

USE cookmaster;

CREATE TABLE users (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL
);

CREATE TABLE recipes (
	id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    user VARCHAR(100) NOT NULL,
	name VARCHAR(100) NOT NULL,
    ingredients VARCHAR(300) NOT NULL,
    instructions VARCHAR(300) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO recipes (user_id, user, name, ingredients, instructions)
VALUES
    ('1', 'Taylor Swift.', 'Cookies', 'milk chocolate flour', 'shake the milk');

SELECT * FROM users;
SELECT * FROM recipes;