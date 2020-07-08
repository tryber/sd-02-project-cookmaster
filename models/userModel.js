const { dbGetSchema } = require('./connection');
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

const insertUser = async (email, pass, firstName, lastName) => {
  await dbGetSchema()
    .then((session) => session.sql(
      `INSERT INTO cook_master.Users
      (email, pass, first_name, last_name)
      VALUES('${email}', '${pass}', '${firstName}', '${lastName}')`
    ).execute())
};

module.exports = {
  findByEmail,
  findById,
  insertUser
};
