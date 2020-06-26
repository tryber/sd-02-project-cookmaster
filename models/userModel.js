const { getTable, getSchema } = require('./connection');

/* Quando você implementar a conexão com o banco, não deve mais precisar desse objeto */
const TEMP_USER = {
  id: 'd2a667c4-432d-4dd5-8ab1-b51e88ddb5fe',
  email: 'taylor.doe@company.com',
  password: 'password',
  name: 'Taylor',
  lastName: 'Doe',
};

/* Substitua o código das funções abaixo para que ela,
de fato, realize a busca no banco de dados */

/**
 * Busca um usuário através do seu email e, se encontrado, retorna-o.
 * @param {string} email Email do usuário a ser encontrado
 */
const findByEmail = async (paramEmail) => {
  const emailSchema = await getSchema();
  const getEmail = await emailSchema.getTable('users')
    .select(['id', 'name', 'last_name', 'email', 'password'])
    .where('email = :email')
    .bind('email', paramEmail)
    .execute()
    .then((results) => results.fetchAll())
    .then((emails) => emails[0]);

  if (!getEmail) return null;
  const [ id, name, lastName, email, password ] = getEmail;
  return { id, name, lastName, email, password };
};

/**
 * Busca um usuário através do seu ID
 * @param {string} id ID do usuário
 */
const findById = async (paramId) => {
  const idSchema = await getSchema();
  const getId = await idSchema.getTable('users')
    .select(['id', 'name', 'last_name', 'email', 'password'])
    .where('id = :id')
    .bind('id', paramId)
    .execute()
    .then((results) => results.fetchAll())
    .then((id) => id[0]);

  if (!getId) return null;
  const [ id, name, lastName, email, password ] = getId;
  return { id, name, lastName, email, password };
};

module.exports = {
  findByEmail,
  findById,
};
