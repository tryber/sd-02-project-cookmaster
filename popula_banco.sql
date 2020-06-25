create database if not exists CookMaster;
use CookMaster;

create table users (
id int primary key auto_increment,
nome varchar(50) not null,
senha varchar(50) not null,
email varchar(50) not null,
lastName varchar(50) not null
) engine=InnoDB;

create table receitas (
id int primary key auto_increment,
nome varchar(50) not null,
ingredientes varchar(50) not null,
modo_de_preparar varchar(50) not null,
user_id int,
foreign key (user_id) references users(id)
) engine=InnoDB;

select * from users;
select * from receitas;