CREATE DATABASE IF NOT EXISTS cookie_master;

USE cookie_master;

CREATE TABLE Users (
    id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(30) UNIQUE NOT NULL,
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
    ('teste1@gmail.com', '123456', 'teste1', 'teste1'),
    ('teste2@hotmail.com', '987654', 'teste2', 'teste2');
    
INSERT INTO Recipes (recipe_name, ingredients, how_to_prepare, creator_id)
VALUES
    ('Macarrão de Miojo', 'Miojo', 'Esquentar a água e colocar miojo', '1'),
    ('Pipoca de microondas', 'pipoca', 'Colocar no microondas', '1'),
    ('Batata frita', 'Batata', 'Fritar a batata', '2'),
    ('Salada', 'Alface e Tomate', 'Cortar o tomate e o alface', '2'),
    ('Pão de alho ao forno', 'Pão de alho', 'Comprar o pão de alho e colocar no forno', '2');
