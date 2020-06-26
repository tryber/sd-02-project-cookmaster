const connection = require('./connection');

const findByEmail = async (email) => {
  const userData = await connection()
    .then((db) =>
      db
        .getTable('user')
        .select(['email', 'password', 'first_name', 'last_name'])
        .where('email = :email')
        .bind('email', email)
        .execute(),
    )
    .then((results) => results.fetchAll())
    .then((user) => user[0]);

  if (!userData) return null;

  [email, password, firstName, lastName] = userData;

  return { email, password, firstName, lastName };
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
