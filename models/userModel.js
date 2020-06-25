const connection = require('./connection');

const findUser = async (param) => {
  const comparator = typeof param === 'number' ? 'id' : 'email';
  const userData = await connection()
    .then((database) => database
      .getTable('users')
      .select(['id', 'email', 'user_password', 'first_name', 'last_name'])
      .where(`${comparator} = :${comparator}`)
      .bind(`${comparator}`, param)
      .execute())
    .then((results) => results.fetchAll())
    .then((users) => users[0]);

  if (!userData) return null;

  const [id, email, password, name, lastName] = userData;

  return { id, email, password, name, lastName };
};

module.exports = {
  findUser,
};
