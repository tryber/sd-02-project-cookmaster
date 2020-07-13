CREATE DATABASE IF NOT EXISTS cookmaster;

USE cookmaster;

CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    password VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE recipes (
	id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    ingredients VARCHAR(300) NOT NULL,
    prepare_method VARCHAR(1000) NOT NULL,
    author_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(author_id) REFERENCES users(id)
);

INSERT INTO users (name, last_name, email, password)
VALUES
	('Felipe', 'Andrade Lima', 'lipe_lim@hotmail.com', '123456789'),
	('John', 'Nova Geração', 'john@hotmail.com', 'senhasenha');

INSERT INTO recipes (name, ingredients, prepare_method, author_id)
VALUES
	('Pipoca', 'Milho para pipoca, Manteiga e Sal', 'Despeje a manteiga numa panela em fogo alto, adiciona o milho para pipoca, feche a tampa da panela, e com o auxilio de um pano, segure nas abas da panela e fique mexendo-a até ouvir o primeiro estouro', 1),
    ('Miojo', 'Pacote de miojo e água', 'Esquenta a água, joga o miojo dentro e espera 3 min, depois coloca o sachê', 2);