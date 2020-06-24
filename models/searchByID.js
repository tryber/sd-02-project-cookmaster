const { connection } = require('./connection');

const byId = async (id, table, arraySelection) => {
  const db = await connection();
  const results = await db.getTable(table)
    .select(arraySelection)
    .where('id = :id')
    .bind('id', id)
    .execute();
  return await results.fetchAll();
};

module.exports = {
  byId,
};