const { connection, connectionSession } = require('./connections');

const findBy = async (data, local) => {
  const userData = await connection()
    .then((db) => db
      .getSchema('cookmaster')
      .getTable('users')
      .select(['id', 'first_name', 'last_name', 'user_pass', 'email'])
      .where(`${local} = :${local}`)
      .bind(`${local}`, data)
      .execute())
    .then((results) => results.fetchAll())
    .then((user) => user[0]);

  if (!userData) return null;

  const [id, name, lastName, password, email] = userData;
  return { id, email, password, name, lastName };
};

const insertUser = async (data) =>
  connection().then((db) => {
    db
      .getSchema('cookmaster')
      .getTable('users')
      .insert(['first_name', 'last_name', 'user_pass', 'email'])
      .values([data.name, data.lastName, data.typePass, data.email])
      .execute();
  });

const validateUser = ({ email, name, lastName, typePass, confirmPass }) => {
  const emailReg = /^(([^<>()\\.,;:\s@']+(\.[^<>()\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
  const namesReg = /^[a-zA-Z]*$/.test(name) && /^[a-zA-Z]*$/.test(lastName);
  const isPassValid = typePass === confirmPass;
  if (!emailReg || !namesReg || !isPassValid) return false;
  return true;
};

const createUser = async (data) => {
  const isUserValid = validateUser(data);

  if (!isUserValid) return { error: 'Dados Inválidos' };

  const isUserExists = await findBy(data.email, 'email');

  if (isUserExists) return { error: 'Usuário já cadastrado' };

  await insertUser(data);

  return { message: 'Usuário cadastrado com sucesso.' };
};

const updateUserQuery = `UPDATE users
SET email = ?, first_name = ?, last_name = ?
WHERE id = ?`;

const updateUser = async ({ email, name, lastName, id }) =>
  connectionSession(updateUserQuery)
    .then((query) => query
      .bind(email)
      .bind(name)
      .bind(lastName)
      .bind(id)
      .execute());


module.exports = {
  createUser,
  updateUser,
  findBy,
};
