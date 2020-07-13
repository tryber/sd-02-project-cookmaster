const config = require('../config');
const mysql = require('@mysql/xdevapi');

const getSession = async () => mysql.getSession(config.database);

const getSchema = async () =>
  getSession().then((session) => session.getSchema(config.database.schema));

const getTable = async (table) =>
  getSchema().then((schema) => schema.getTable(table));

const runQuery = async (query) => {
  const session = await getSession();
  const results = await session.sql(query);
  session.close();
  return results;
};

module.exports = {
  getSession,
  getSchema,
  getTable,
  runQuery,
};
