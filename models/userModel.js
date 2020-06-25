const connection = require('./connection');

const findUser = async (param) => {
  const userData = await connection()
    .then((database) => database
      .getTable('users')
      .select(['id', 'email', 'user_password', 'first_name', 'last_name'])
      .where('id = :param OR email = :param')
      .bind('param', param)
      .execute())
    .then((results) => results.fetchAll())
    .then((users) => users[0]);

  if (!userData) return null;

  const [id, email, password, name, lastName] = userData;

  return { id, email, password, name, lastName };
};

const registerNewUser = async (newUserData) => {
  const { email, password, firstName, lastName } = newUserData;
  await connection()
    .then((database) => database
      .getTable('users')
      .insert(['email', 'user_password', 'first_name', 'last_name'])
      .values(email, password, firstName, lastName)
      .execute());
};

module.exports = {
  findUser,
  registerNewUser,
};
