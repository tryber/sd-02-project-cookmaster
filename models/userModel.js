const connection = require('./connection');

async function findUser(param) {
  const comparator = typeof param === 'number' ? 'id' : 'email';
  const userData = await connection()
    .then((database) => database
      .getTable('cookmaster')
      .select(['id', 'email', 'user_password', 'first_name', 'last_name'])
      .where(`${comparator} = :${comparator}`)
      .bind(`${comparator}`, param)
      .execute())
    .then((results) => results.fetchAll())
    .then((users) => users[0]);

  if (!userData) return null;

  const [id, email, password, firstName, lastName] = userData;

  return { id, email, password, firstName, lastName };
}

const findByEmail = async (userEmail) => {
  findUser(userEmail);
};

const findById = async (userId) => {
  findUser(userId);
};

module.exports = {
  findByEmail,
  findById,
};
