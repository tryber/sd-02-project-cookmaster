const getSchema = require('./getSchema');

const validEmail = (email) => (
  (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/).test(email)
);

const validParams = (...args) => (
  args.every((ele) => ele.length > 0)
);

const postFunction = async (paramInsert, paramValues, table) => (
  getSchema()
    .then((db) =>
      db
        .getTable(table)
        .insert(paramInsert)
        .values(...paramValues)
        .execute(),
    ).then(() => true)
    .catch((err) => `Erro Inesperado! Não foi possível cadastrar.${err}`)
);

const postUser = async ({ email, name, lastName, password }) => {
  if (!validEmail(email)) return 'Email Invalido';
  if (!validParams(name, lastName, password)) return 'Não deve haver campos vazios';
  return postFunction(['email', 'pass', 'first_name', 'last_name'],
    [email, password, name, lastName],
    'Users');
};

module.exports = { postUser, validParams, postFunction };
