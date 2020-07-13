const connection = require('./connections');

const findByEmail = async (emailInput) => {
  const userData = await connection().then((db) =>
    db
      .getSchema("cookmaster")
      .getTable("users")
      .select(["id", "first_name", "last_name", "user_pass", "email"])
      .where("email = :email")
      .bind("email", emailInput)
      .execute()
  )
    .then((results) => results.fetchAll())
    .then((user) => user[0]);

  if (!userData) return null;

  const [id, name, lastName, password, email] = userData;
  console.log()
  return { id, email, password, name, lastName };
};

const findById = async (idInput) => {
  const userData = await connection().then((db) =>
    db
      .getSchema("cookmaster")
      .getTable("users")
      .select(["id", "first_name", "last_name", "user_pass", "email"])
      .where("id = :id")
      .bind("id", idInput)
      .execute()
  )
    .then((results) => results.fetchAll())
    .then((user) => user[0]);

  if (!userData) return null;

  const [id, name, lastName, password, email] = userData;
  return { id, email, password, name, lastName };
};

module.exports = {
  findByEmail,
  findById,
};
