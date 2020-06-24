const { connection } = require('./connection');
const { byId } = require('./searchByID.js');
const { insertDb } = require('./insertDB');

const findByEmail = async (email) => {
  try {
    const db = await connection();
    const results = await db.getTable('Users')
      .select(['email', 'pass', 'id'])
      .where('email = :email')
      .bind('email', email)
      .execute();
    const user = await results.fetchAll();
    if (!user.length) return false;
    return { userEmail: user[0][0], password: user[0][1], id: user[0][2] };
  } catch (e) {
    console.log(e);
  }
};

const findById = async (id) => {
  try {
    const arraySelection = ['email', 'pass', 'id', 'first_name', 'last_name'];
    const user = await byId(id, 'Users', arraySelection);
    return { name: user[0][3], lastName: user[0][4], id: user[0][2] };
  } catch (e) {
    console.log(e);
  }
};

const checkEmail = async (email) => {
  if (!email || !email.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i)) {
    return 'E-mail inválido';
  }
  const checkIfEmailExists = await findByEmail(email);
  console.log(checkIfEmailExists);
  if (checkIfEmailExists) {
    return 'E-mail já cadastrado';
  }
  return false;
};

const validadeFormNewUser = async ({ email, password, confirmPass, firstName, lastName }) => {
  const arrayErrors = [];
  const check = await checkEmail(email);
  if (check) arrayErrors.push(check);
  if (!firstName || !lastName) arrayErrors.push('Nome e sobrenome são obrigatórios');
  if (!password || password !== confirmPass) {
    arrayErrors.push('O password é requerido e deve ser igual à confirmação do password');
  }
  return arrayErrors;
};

const createNewUserOnDB = async ({ email, password, firstName, lastName }) => {
  const fields = ['email', 'pass', 'first_name', 'last_name'];
  const params = [email, password, firstName, lastName];
  await insertDb('Users', fields, params);
};

module.exports = {
  findByEmail,
  findById,
  validadeFormNewUser,
  createNewUserOnDB,
};
