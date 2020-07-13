CREATE DATABASE IF NOT EXISTS cookmaster;

USE cookmaster;

CREATE TABLE users(
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  user_pass VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE recipes(
  recipe_id INT NOT NULL AUTO_INCREMENT,
  recipe_name VARCHAR(50) NOT NULL,
  ingredients TEXT NOT NULL,
  process_recipe TEXT NOT NULL,
  insert_user INT NOT NULL,
  PRIMARY KEY(recipe_id),
  FOREIGN KEY(insert_user) REFERENCES users(id)
);

INSERT INTO users (first_name, last_name, user_pass, email) VALUES 
('Richard','Wellerson','1','rw@rw.com'),
('Folgado', 'Martins', 'ladygaga','fm@fm.com');

SELECT * FROM users;

INSERT INTO recipes (recipe_name, ingredients, process_recipe, insert_user) VALUES
('Sopa de banana verde', 'Banana verde \n temperos', 'Mistura tudo e cozinha', '1'),
('Pipoca', 'Milho de pipoca \n Oleo', 'Esquenta o óleo e joga a pipoca com sazon', '2');

SELECT * FROM recipes;