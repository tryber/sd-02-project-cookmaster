const connection = require('./connection');

async function findByEmail(email) {
  const userData = await connection()
    .then((db) =>
      db
        .getTable('user')
        .select(['id', 'email', 'password', 'first_name', 'last_name'])
        .where('email = :email')
        .bind('email', email)
        .execute(),
    )
    .then((results) => results.fetchAll())
    .then((user) => user[0]);

  if (!userData) return null;

  [id, email, password, firstName, lastName] = userData;

  return { id, email, password, firstName, lastName };
}

const findById = async (id) => {
  const userData = await connection()
    .then((db) =>
      db
        .getTable('user')
        .select(['id', 'email', 'password', 'first_name', 'last_name'])
        .where('id = :id')
        .bind('id', id)
        .execute(),
    )
    .then((results) => results.fetchAll())
    .then((user) => user[0]);

  if (!userData) return null;

  [id, email, password, firstName, lastName] = userData;

  return { id, email, password, firstName, lastName };
};

module.exports = {
  findByEmail,
  findById,
};
