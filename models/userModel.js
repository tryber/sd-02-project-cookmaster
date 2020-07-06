const { dbGetSchema } = require('../models/connection');
/* Substitua o código das funções abaixo para que ela,
de fato, realize a busca no banco de dados */
const TEMP_USER = {
  id: 'd2a667c4-432d-4dd5-8ab1-b51e88ddb5fe',
  email: 'taylor.doe@company.com',
  password: 'password',
  name: 'Taylor',
  lastName: 'Doe',
};
/**
 * Busca um usuário através do seu email e, se encontrado, retorna-o.
 * @param {string} email Email do usuário a ser encontrado
 */
const findByEmail = async (param) => {
  const emailData = await dbGetSchema()
  .then((db) =>
    db
      .getTable('Users')
      .select(['id', 'email', 'pass', 'first_name', 'last_name'])
      .where('email = :email')
      .bind('email', param)
      .execute()
  )
  .then((results) => results.fetchAll())
  .then((emailList) => emailList[0]);

  if (!emailData) return null;

  const [id, email, password] = emailData;

  return { id, email, password };
};

/**
 * Busca um usuário através do seu ID
 * @param {string} id ID do usuário
 */
const findById = async (userId) => {
  const userData = await dbGetSchema()
  .then((db) =>
    db
      .getTable('Users')
      .select(['id', 'email', 'pass', 'first_name', 'last_name'])
      .where('id = :id')
      .bind('id', userId)
      .execute()
  )
  .then((results) => results.fetchAll())
  .then((emailList) => emailList[0]);

  if (!userData) return null;

  const [id, email, password, name, lastName] = userData;

  return { id, email, password, name, lastName };
};

module.exports = {
  findByEmail,
  findById,
};
