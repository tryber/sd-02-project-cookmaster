const { connection } = require("./conection");

const findByEmail = async (inputEmail) =>
  connection()
    .then((db) =>
      db.getTable('users')
      .select(['id', 'nome', 'senha', 'email', 'lastName'])
      .where('email = :email')
      .bind('email', inputEmail)
      .execute()
    )
    .then((results) => results.fetchAll()[0])
    .then(([id, nome, senha, email, lastName]) =>
      ({ id, name: nome, password: senha, email, lastName }));


const findById = async (id) => 
  connection()
    .then((db) =>
      db.getTable('users')
      .select(['id', 'nome', 'senha', 'email', 'lastName'])
      .where('id = :id')
      .bind('id', id)
      .execute()
    )
    .then((results) => results.fetchAll()[0])
    .then(([id, nome, senha, email, lastName]) => ({ id, nome, senha, email, lastName }));


const addUser = async ({ nome, senha, email, lastName }) =>
  connection()
    .then((db) =>
      db.getTable('users')
      .insert(['nome', 'senha', 'email', 'lastName'])
      .value(nome, senha, email, lastName)
      .execute()
    );


module.exports = {
  findByEmail,
  findById,
  addUser,
};
