const { getSession } = require('./connection');

const queryDb = async (query) => {
  const db = await getSession();
  const sesions = await db.sql(query).execute();
  const recipes = await sesions.fetchAll();
  return recipes;
};

module.exports = {
  queryDb,
};
