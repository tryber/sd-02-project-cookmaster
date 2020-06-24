const getSchema = require('./getSchema');

/* const TEMP_USER = {
  id: 'd2a667c4-432d-4dd5-8ab1-b51e88ddb5fe',
  email: 'taylor.doe@company.com',
  password: 'password',
  name: 'Taylor',
  lastName: 'Doe',
}; */

const findByEmail = async (param) => {
  const emailSchema = await getSchema();
  const userEmailData = await emailSchema
    .getTable('users')
    .select(['id', 'email', 'password'])
    .where('email = :email')
    .bind('email', param)
    .execute()
    .then((results) => results.fetchAll())
    .then((emails) => emails[0]);

  if (!userEmailData) return null;

  const [id, email, password] = userEmailData;

  return { id, email, password };
};

const findById = async (param) => {
  const userSchema = await getSchema();
  const sql = await userSchema
    .getTable('users')
    .select(['id', 'email', 'password', 'first_name', 'last_name'])
    .where('id = :id')
    .bind('id', param)
    .execute();
  const fetch = await sql.fetchAll();
  const userIdData = fetch[0];

  if (!userIdData) return null;

  const [id, email, password, name, lastName] = userIdData;

  return { id, email, password, name, lastName };
};

const isValid = (email, password, firstName, lastName) => {
  if (!email || !password || !firstName || !lastName) return false;
  if (typeof email !== 'string' || typeof password !== 'string'
    || typeof firstName !== 'string' || typeof lastName !== 'string') return false;
  return true;
};

const insertUser = async (email, password, firstName, lastName) => {
  const db = await getSchema();
  await db.getTable('users')
    .insert(['email', 'password', 'first_name', 'last_name'])
    .values(email, password, firstName, lastName)
    .execute();
};

module.exports = { findByEmail, findById, isValid, insertUser };
