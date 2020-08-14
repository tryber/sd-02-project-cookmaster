DROP DATABASE IF EXISTS project_cookmaster;

CREATE DATABASE IF NOT EXISTS project_cookmaster;

USE project_cookmaster;

CREATE TABLE users (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    last_name VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL
);

CREATE TABLE recipes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    recipe_description VARCHAR(500) NOT NULL
);

CREATE TABLE ingredients (
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    ingredient_name VARCHAR(50) NOT NULL
);

CREATE TABLE recipes_ingredients (
    recipe_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    PRIMARY KEY(recipe_id, ingredient_id),
    FOREIGN KEY(recipe_id) REFERENCES recipes(id),
    FOREIGN KEY(ingredient_id) REFERENCES ingredients(ingredient_id)
);

CREATE TABLE users_recipes (
	user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    PRIMARY KEY(user_id, recipe_id),
    FOREIGN KEY(recipe_id) REFERENCES recipes(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

INSERT INTO users (name, last_name, email, password) VALUES
    ('Taylor', 'Doe', 'taylor.doe@company.com', 'password');


INSERT INTO recipes (name, recipe_description ) VALUES
    ('Tutu de feijao', 'Faça o feijão direitinho e bata tudo no liquidificador.'),
   	('Inhoque', 'Prepare o Inhoque');
   
INSERT INTO ingredients (ingredient_name) VALUES
	('Feijão'),
	('Inhoque'),
	('Macarrão');

INSERT INTO recipes_ingredients (recipe_id, ingredient_id) VALUES
	(1, 1),
	(2, 2),
	(2, 3);

INSERT INTO users_recipes (user_id, recipe_id) VALUES
	(1, 1),
	(1, 2);

   
SELECT * FROM recipes_ingredients ri ;
