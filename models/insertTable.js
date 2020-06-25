const connection = require('./connection');

const insertTable = async (tableName, tableColumns, newRecipeData) =>
  connection()
    .then((db) => db
      .getTable(tableName)
      .insert(tableColumns)
      .values(...Object.values(newRecipeData))
      .execute());

module.exports = insertTable;
