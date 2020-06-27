CREATE DATABASE IF NOT EXISTS cookmaster;

USE cookmaster;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_password VARCHAR(15),
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL
)ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS recipes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recipe_name VARCHAR(50) NOT NULL,
    ingredients VARCHAR(255) NOT NULL,
    instructions VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    CONSTRAINT fk_recipes_users FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB;


INSERT INTO users (email, user_password, first_name, last_name)
VALUES 
('gui7fc@gmail.com', 'lalala', 'Guilherme', 'Crespo'),
('gui6@msn.com', 'xablau', 'João', 'Zinho');

INSERT INTO recipes (recipe_name, ingredients, instructions, user_id)
VALUES
(
'estrogonofe de frango', 
'frango,creme de leite,molho de tomate,sal,pimenta do reino,cebola',
'junta tudo e pronto',
1
),
(
'bolo de cenoura com chocolate',
'farinha,açúcar,fermento,cenoura,chocolate meio amargo,ovos,leite',
'bate tudo no liquidificador e leva pro forno o quanto quiser',
2
);