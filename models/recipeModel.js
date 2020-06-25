const { getTable } = require('./connection');

const FIELDS = ['id', 'name', 'ingredients', 'prepare_method', 'author_id'];

const getRecipesFromDataBase = async (table) => {
  return getTable(table)
    .then((table) =>
      table.select(FIELDS).execute()
    )
    .then((results) => results.fetchAll()[0])
    .then((recipeResult) => {
      if (!recipeResult) return null;
      const [ id, name, ingredients, prepare_method, author_id ] = recipeResult;

      return {
        id,
        name,
        ingredients,
        prepare_method,
        author_id,
      };
    });
}

module.exports = {
  getRecipesFromDataBase,
};
