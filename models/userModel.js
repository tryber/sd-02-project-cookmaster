const { connection, getSession } = require('./conection');

const findByEmail = async (inputEmail) =>
  connection()
    .then((db) =>
      db.getTable('users')
      .select(['id', 'nome', 'senha', 'email', 'lastName'])
      .where('email = :email')
      .bind('email', inputEmail)
      .execute(),
    )
    .then((results) => results.fetchAll()[0])
    .then(([id, nome, senha, email, lastName]) =>
      ({ id, name: nome, password: senha, email, lastName }));


const findById = async (userId) =>
  connection()
    .then((db) =>
      db.getTable('users')
      .select(['id', 'nome', 'senha', 'email', 'lastName'])
      .where('id = :id')
      .bind('id', userId)
      .execute(),
    )
    .then((results) => results.fetchAll()[0])
    .then(([id, nome, senha, email, lastName]) => ({ id, nome, senha, email, lastName }));


const addUser = async ({ nome, senha, email, lastName }) =>
  getSession()
    .then((session) => session.sql(`insert into users(nome, senha, email, lastName) values(?, ?, ?, ?)`)
      .bind(nome)
      .bind(senha)
      .bind(email)
      .bind(lastName)
      .execute(),
    );

const update = async (nome, email, senha, lastName, id) =>
  getSession()
  .then((session) => session.sql(`update users set nome = ?, email = ?, senha = ?,
    lastName = ? where id = ?`)
    .bind(nome)
    .bind(email)
    .bind(senha)
    .bind(lastName)
    .bind(id)
    .execute(),
  );

module.exports = {
  findByEmail,
  findById,
  addUser,
  update,
};
