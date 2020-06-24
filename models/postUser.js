const getSchema = require('./getSchema');
const validEmail = (email) => (
  (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/).test(email)
);

const validParams = (...args) => (
  args.every((ele) => ele.length > 0)
);

const postUser = async ({ email, name, lastName, password }) => {
  if (!validEmail(email)) return 'Email Invalido';
  if (!validParams([name, lastName, password])) return 'Não deve haver campos vazios';
  return getSchema()
    .then((db) =>
      db
        .getTable('Users')
        .insert(['email', 'pass', 'first_name', 'last_name'])
        .values(email, password, name, lastName)
        .execute(),
    )
    .then(() => true)
    .catch(() => 'Erro Inesperado! Mão foi possível cadastrar usuario.')
}

module.exports = { postUser, validParams };
