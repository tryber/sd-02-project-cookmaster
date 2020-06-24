const getSchema = require('./getSchema');

const validEmail = (email) => (
  (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/).test(email)
);

const validParams = (...args) => (
  args.every((ele) => ele.length > 0)
);

const postFunction = (paramInsert, paramValues) => (
  getSchema()
    .then((db) =>
      db
        .getTable('Users')
        .insert(paramInsert)
        .values(...paramValues)
        .execute(),
    )
);

const postUser = async ({ email, name, lastName, password }) => {
  if (!validEmail(email)) return 'Email Invalido';
  if (!validParams([name, lastName, password])) return 'Não deve haver campos vazios';
  return postFunction
    (
      ['email', 'pass', 'first_name', 'last_name'],
      [email, name, lastName, password],
    )
    .then(() => true)
    .catch(() => 'Erro Inesperado! Mão foi possível cadastrar usuario.');
};

module.exports = { postUser, validParams, postFunction };
