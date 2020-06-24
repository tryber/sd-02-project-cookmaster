const { connection } = require('./connection');

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
    const db = await connection();
    const result = await db.getTable('Users')
      .select(['email', 'pass', 'id', 'first_name', 'last_name'])
      .where('id = :id')
      .bind('id', id)
      .execute();
    const user = await result.fetchAll();
    return { name: user[0][3], lastName: user[0][4], id: user[0][2] };
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  findByEmail,
  findById,
};
