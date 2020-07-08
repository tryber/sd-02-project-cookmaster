const getSchema = require('./getSchema');

/* Quando você implementar a conexão com o banco, não deve mais precisar desse objeto */
// const TEMP_USER = {
//   id: 'd2a667c4-432d-4dd5-8ab1-b51e88ddb5fe',
//   email: 'taylor.doe@company.com',
//   password: 'password',
//   name: 'Taylor',
//   lastName: 'Doe',
// };

/* Substitua o código das funções abaixo para que ela,
de fato, realize a busca no banco de dados */

/**
 * Busca um usuário através do seu email e, se encontrado, retorna-o.
 * @param {string} email Email do usuário a ser encontrado
 */

const findByEmail = async (email) =>
  getSchema()
    .then((db) =>
      db
        .getTable('Users')
        .select(['id', 'pass'])
        .where('email = :email')
        .bind('email', email)
        .execute(),
    )
    .then((results) => results.fetchAll()[0])
    .then(([id, password]) =>
      ({ id, password }))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });


/**
 * Busca um usuário através do seu ID
 * @param {string} id ID do usuário
 */

const findById = async (idUser) =>
  getSchema()
    .then((db) =>
      db
        .getTable('Users')
        .select(['id', 'email', 'first_name', 'last_name'])
        .where('id = :id')
        .bind('id', idUser)
        .execute(),
    )
    .then((results) => results.fetchAll()[0])
    .then(([id, email, name, lastName]) =>
      ({ id, email, name, lastName }))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });

module.exports = {
  findByEmail,
  findById,
};
