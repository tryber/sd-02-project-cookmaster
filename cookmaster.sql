CREATE DATABASE IF NOT EXISTS cookmaster;

USE cookmaster;

CREATE TABLE users (
	id INT NOT NULL primary key auto_increment,
    first_name varchar(100),
    last_name varchar(100),
    email varchar(100),
    pass varchar(50)
);

CREATE TABLE recipes (
	id INT NOT NULL primary key auto_increment,
    recipe_name varchar(100),
    ingredients varchar(100),
    recipe varchar(500),
    author_id INT NOT NULL,
    foreign key (author_id) references users(id)
);

INSERT INTO users (first_name, last_name, email, pass)
VALUES
	('Julio Cezar', 'Taveira', 'jctaraujo@hotmail.com', '123456'),
  ('Jaspion', 'Salvatore', 'jaspionSalvatore@hotmail.com', '12345');

INSERT INTO recipes (recipe_name, ingredients, recipe, author_id)
VALUES
	('Suco de limão', 'Agua e Limao', 'Cortar o limao e misturar com a agua', 1),
  ('Arroz', 'Arroz cru, agua e temperos', 'Refogar o arroz cru com o tempero, colocar agua até cubrir o arroz e deixar cozinhando ate secar agua', 2);
    