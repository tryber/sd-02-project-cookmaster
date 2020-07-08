const getSchema = require('./getSchema');

const oneRecipe = async (idUser) =>
  getSchema()
    .then((db) =>
      db
        .getTable('Recipes')
        .select(['id', 'recipe_name', 'ingredients', 'how_to_prepare', 'creator_id'])
        .where('id = :id')
        .bind('id', idUser)
        .execute(),
    )
    .then((results) => results.fetchAll()[0])
    .then((response) => (response))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });


module.exports = oneRecipe;
