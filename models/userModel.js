const connection = require('./connection');

/* Quando você implementar a conexão com o banco, não deve mais precisar desse objeto */
const TEMP_USER = {
  id: 1,
  email: 'taylor.doe@company.com',
  password: 'password',
  name: 'Taylor',
  lastName: 'Doe',
};

/* Substitua o código das funções abaixo para que ela,
de fato, realize a busca no banco de dados */

/**
 * Busca um usuário através do seu email e, se encontrado, retorna-o.
 * @param {string} email Email do usuário a ser encontrado
 */
const findByEmail = async (userEmail) => {
  const registeredUser = await connection().then((db) =>
    db
      .getTable('users')
      .select(['id', 'email', 'password', 'name', 'last_name'])
      .where('email = :userEmail')
      .bind('userEmail', userEmail)
      .execute()
      .then((results) => results.fetchAll())
      .then(([data]) => data));

  return registeredUser;
};

/**
 * Busca um usuário através do seu ID
 * @param {string} id ID do usuário
 */
const findById = async (id) => {
  return TEMP_USER;
};

module.exports = {
  findByEmail,
  findById,
};
