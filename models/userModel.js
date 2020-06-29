/* Quando você implementar a conexão com o banco, não deve mais precisar desse objeto */
const TEMP_USER = {
  id: 'd2a667c4-432d-4dd5-8ab1-b51e88ddb5fe',
  email: 'taylor.doe@company.com',
  password: 'password',
  name: 'Taylor',
  lastName: 'Doe',
};

const connection = require('./connection');

const getNewUser = (userData) => {
  const { id, firstName, lastName, email, password } = userData;

  const fullName = [firstName, lastName].join(' ');

  return {
    id,
    name: fullName,
    email,
    password,
  };
};

/* Substitua o código das funções abaixo para que ela,
de fato, realize a busca no banco de dados */

/**
 * Busca um usuário através do seu email e, se encontrado, retorna-o.
 * @param {string} email Email do usuário a ser encontrado
 */
const findByEmail = async (email) => {
  return connection()
    .then((session) => session.getSchema('cookmaster'))
    .then((db) => (
      db
        .getTable('users')
        .select(['id', 'first_name', 'last_name', 'email', 'password'])
        .where('email = :email')
        .bind('email', email)
        .execute()
    ))
    .then((results) => results.fetchAll())
    .then((users) => (
      users.map(([id, firstName, lastName, email, password]) =>
        getNewUser({ id, firstName, lastName, email, password })
      )[0]
    ));
};

/**
 * Busca um usuário através do seu ID
 * @param {string} id ID do usuário
 */
const findById = async (id) => {
  return connection()
    .then((session) => session.getSchema('cookmaster'))
    .then((db) => (
      db
        .getTable('users')
        .select(['id', 'first_name', 'last_name', 'email', 'password'])
        .where('id = :id')
        .bind('id', id)
        .execute()
    ))
    .then((results) => results.fetchAll())
    .then((users) => (
      users.map(([id, firstName, lastName, email, password]) =>
        getNewUser({ id, firstName, lastName, email, password })
      )[0]
    ));
};

const registerNewUser = async (userData) => {
  const { email, password, firstName, lastName } = userData;

  return connection()
    .then((session) => session.getSchema('cookmaster'))
    .then((db) => (
      db
        .getTable('users')
        .insert(['first_name', 'last_name', 'email', 'password'])
        .values([firstName, lastName, email, password])
        // .bind('firstName', firstName)
        // .bind('lastName', lastName)
        // .bind('email', email)
        // .bind('password', password)
        .execute()
    ))
    // .then((results) => results.fetchAll())
    // .then((users) => (
    //   users.map(([id, firstName, lastName, email, password]) =>
    //     getNewUser({ id, firstName, lastName, email, password })
    //   )[0]
    // ));
};

module.exports = {
  findByEmail,
  findById,
  registerNewUser,
};
