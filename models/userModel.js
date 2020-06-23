const connection = require('./connection');

const findByEmail = async (userEmail) => {
  const userData = await connection()
    .then((database) => database
      .getTable('cookmaster')
      .select(['id', 'email', 'user_password', 'first_name', 'last_name'])
      .where('email = :email')
      .bind('email', userEmail)
      .execute())
    .then((results) => results.fetchAll())
    .then((users) => users[0]);

  if (!userData) return null;

  const [id, email, password, firstName, lastName] = userData;

  return { id, email, password, firstName, lastName };
};

const findById = async (userId) => {
  const userData = await connection()
    .then((database) => database
      .getTable('cookmaster')
      .select(['id', 'email', 'user_password', 'first_name', 'last_name'])
      .where('id = :id')
      .bind('id', userId)
      .execute())
    .then((results) => results.fetchAll())
    .then((users) => users[0]);

  if (!userData) return null;

  const [id, email, password, firstName, lastName] = userData;

  return { id, email, password, firstName, lastName };
};

module.exports = {
  findByEmail,
  findById,
};
