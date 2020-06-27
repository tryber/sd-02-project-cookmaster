const connection = require('./connection');

async function findUser({ key, value }) {
  const userData = await connection()
    .then((db) =>
      db
        .getTable('users')
        .select(['id', 'email', 'password', 'first_name', 'last_name'])
        .where(`${key} = :${key}`)
        .bind(key, value)
        .execute(),
    )
    .then((results) => results.fetchAll())
    .then((user) => user[0]);

  if (!userData) return null;

  [id, email, password, firstName, lastName] = userData;

  const fullName = `${firstName} ${lastName}`;

  return { id, email, password, firstName, lastName, fullName };
}

module.exports = {
  findUser,
};
