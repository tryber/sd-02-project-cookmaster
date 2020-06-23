CREATE DATABASE IF NOT EXISTS cookmaster;

USE cookmaster;

CREATE TABLE users(
  id INT NOT NULL AUTO_INCREMENT,
  user_name VARCHAR(50) NOT NULL,
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

