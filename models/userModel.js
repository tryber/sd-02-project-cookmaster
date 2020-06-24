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
    .select(['id', 'email', 'password', 'first_name', 'last_name'])
    .where('email = :email')
    .bind('email', param)
    .execute()
    .then((results) => results.fetchAll())
    .then((emails) => emails[0]);

  if (!userEmailData) return null;

  const [id, email, password, firstName, lastName] = userEmailData;

  return { id, email, password, firstName, lastName };
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

  console.log('usr', userIdData);

  if (!userIdData) return null;

  const [id, email, password, firstName, lastName] = userIdData;

  return { id, email, password, firstName, lastName };
};

module.exports = { findByEmail, findById };
