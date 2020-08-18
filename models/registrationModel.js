const connection = require('./connection');
const userModel = require('./userModel');

const registerNewUser = async (userData = null) => {
  if (!userData) return { message: 'Valores inválidos', redirect: false };
  const { email, name, lastName, password } = userData;

  const doesUserExists = await userModel.findByEmail(email);
  if (doesUserExists) return { message: 'E-mail já cadastrado', redirect: false };

  const registerUser = await connection().then((db) =>
    db
      .getTable('users')
      .insert(['email', 'name', 'last_name', 'password'])
      .values([email, name, lastName, password])
      .execute()
      .then((data) => data));

  return { message: 'Usuário cadastrado com sucesso.', redirect: true };
};

module.exports = {
  registerNewUser,
};
