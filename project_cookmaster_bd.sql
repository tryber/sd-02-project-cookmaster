CREATE DATABASE IF NOT EXISTS project_cookmaster;

USE project_cookmaster;

CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY `email_un` (email)
);

CREATE TABLE recipes (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    ingredients VARCHAR(200) NOT NULL,
    prepare_method VARCHAR(500) NOT NULL,
    author_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (author_id) REFERENCES users(id)
);

INSERT INTO users (id, email, password, first_name, last_name) VALUES 
	('1', 'rogeriomunhoz@betrybe.com.br', 'senhaGrande', 'Rogerio', 'Munhoz'),
    ('2', 'johnatas@trybe.com.br', '1024', 'Johnatas', 'Henrique');

INSERT INTO recipes(id, name, ingredients, prepare_method, author_id) VALUES
('1', 'Miojo', 'Pacote de miojo e água', 'Esquenta a água, joga o miojo dentro e espera 3 min, depois coloca o sachê', 1),
('2', 'Batata-frita', 'Batatas e óleo', 'Descasque e corte as batatas em formato de palitos, esquente o óleo até ferver e depois jogue as batatas cortadas dentro.', '2');