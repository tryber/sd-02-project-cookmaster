CREATE DATABASE IF NOT EXISTS cook_master;

USE cook_master;

CREATE TABLE Users (
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(30) NOT NULL UNIQUE,
    pass VARCHAR(30),
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE Recipes (
    id INT NOT NULL AUTO_INCREMENT,
    recipe_name VARCHAR(30) NOT NULL,
    ingredients VARCHAR(100) NOT NULL,
    how_to_prepare VARCHAR(350) NOT NULL,
    creator_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (creator_id) REFERENCES Users(id)
);

INSERT INTO Users (email, pass, first_name, last_name)
VALUES
    ('kevin@yahoo.com', '159487', 'Kevin', 'Mendes'),
    ('shiba@hotmail.com', '326159', 'Shiba', 'Inu'),
    ('tatsu@gmail.com', '487326', 'Tatsu', 'Maki');
    
    
INSERT INTO Recipes (recipe_name, ingredients, how_to_prepare, creator_id)
VALUES
    ('Pizza', 'Pizza Sadia', 'Tirar da caixa e do plástico e colocar no forno', '1'),
    ('Pipoca de microondas', 'Pipoca', 'Colocar no microondas', '1'),
    ('Batata frita', 'Batata', 'Fritar a batata', '2'),
    ('Biscoito', 'Biscoito', 'Abrir o pacote e comer', '2'),
    ('Sanduiche', 'Celular e dinheiro', 'Peça o sanduíche de sua escolha e pague', '2'),
    ('Omelete', 'Ovos', 'Bater gema e clara dos ovos e deixar na frigideira', '3');

-- ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY '123123';

-- FLUSH PRIVILEGES;