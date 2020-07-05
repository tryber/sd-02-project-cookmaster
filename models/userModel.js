const { getSchema, getSession } = require('./connection');

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
  const [id, name, lastName, email, password] = getEmail;
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
  const [id, name, lastName, email, password] = getId;
  return { id, name, lastName, email, password };
};

const createUser = async (query) => {
  const session = await getSession();
  return session.sql(query).execute();
};

module.exports = {
  findByEmail,
  findById,
  createUser,
};
