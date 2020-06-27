const connection = require('./connection');
const useSession = require('./useSession');

const findUser = async (tableColumn) => {
  const userData = await connection()
    .then((database) => database
      .getTable('users')
      .select(['id', 'email', 'user_password', 'first_name', 'last_name'])
      .where('id = :tableColumn OR email = :tableColumn')
      .bind('tableColumn', tableColumn)
      .execute())
    .then((results) => results.fetchAll())
    .then((users) => users[0]);

  if (!userData) return null;

  const [id, email, password, name, lastName] = userData;

  return { id, email, password, name, lastName };
};

const registerNewUser = async (newUserData) => {
  const { email, password, firstName, lastName } = newUserData;
  return connection()
    .then((database) => database
      .getTable('users')
      .insert(['email', 'user_password', 'first_name', 'last_name'])
      .values(email, password, firstName, lastName)
      .execute());
};

const checkPassword = async (email, password) => {
  const passwordChecking = await connection()
    .then((database) =>
      database
        .getTable('users')
        .select(['id'])
        .where('email = :email AND user_password = :password')
        .bind('email', email)
        .bind('password', password)
        .execute())
    .then((results) => results.fetchAll())
    .then((users) => users[0]);

  if (!passwordChecking) return false;
  return true;
};

const updateUser = async (userData) => {
  const { email, password, firstName, lastName, id } = userData;
  useSession()
    .then((session) =>
      session
        .sql(`UPDATE users
              SET
              email = ?,
              user_password = ?,
              first_name = ?,
              last_name = ?
              WHERE id = ?`)
        .bind(email)
        .bind(password)
        .bind(firstName)
        .bind(lastName)
        .bind(id)
        .execute());
};

module.exports = {
  findUser,
  registerNewUser,
  checkPassword,
  updateUser,
};
