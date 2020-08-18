const connection = require('../connection');

const editUser = async (userData = null, userId) => {
  if (!userData) return { message: 'Valores inválidos', redirect: false };

  const { email, name, lastName, password } = userData;

  await connection().then((db) =>
    db
      .getTable('users')
      .update()
      .where('id = :userId')
      .bind('userId', userId)
      .set('email', email)
      .set('name', name)
      .set('last_name', lastName)
      .set('password', password)
      .execute()
      .then((data) => data));

  return { message: 'Usuário modificado com sucesso.', redirect: true };
};

module.exports = {
  editUser,
};
