DROP DATABASE IF EXISTS cookmaster;
CREATE DATABASE cookmaster;
USE cookmaster;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(50) NOT NULL
);

CREATE TABLE recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(50),
  ingredients TEXT,
  directions TEXT,
  author_id INT NOT NULL,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

INSERT INTO users (first_name, last_name, email, password)
  VALUES
    ('Miguel', 'Miranda', 'miguel@gmail.com', '123'),
    ('m', 'm', 'm', 'm');

INSERT INTO recipes (title, ingredients, directions, author_id)
  VALUES
    (
      'Ovo frito',
      '1 ovo, óleo, sal a gosto',
      'Frite o ovo com óleo numa frigideira. Adicione sal a gosto.',
      1
    ),
    (
      'Miojo',
      '1 miojo, água',
      'Cozinhe o miojo em água numa panela por 3 minutos. Adicione o sachê de tempero.',
      2
    ),
    (
      'Ovo cozido',
      '1 ovo, água, sal a gosto',
      'Cozinhe o ovo em água numa panela por 7 minutos. Adicione sal a gosto.',
      1
    );
