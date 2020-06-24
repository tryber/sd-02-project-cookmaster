const { connection } = require('./connection');

const insertDb = async (table, fields, params) => {
  const db = await connection();
  await db.getTable(table)
    .insert(fields)
    .values(...params).execute();
}

module.exports = {
  insertDb,
};
