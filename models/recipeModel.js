const { dbLogin, dbGetSchema } = require('./connection');
// buscando as receitas no banco, retornando todas as cadastradas.
const listRecipes = () => (
  dbLogin()
    .then((session) => session.sql(
      `SELECT
      r.id,
      r.recipe_name,
      r.ingredients,
      r.how_to_prepare,
      u.first_name,
      u.last_name
      FROM Recipes as r
      INNER JOIN Users as u
      ON u.id = r.author_id`,
    ).execute())
    .then((results) => results.fetchAll())
    .then((recipes) => recipes
      .map(([id, recipeName, ingredients, howToPrepare, firstName, lastName]) => ({
        id,
        recipeName,
        ingredients,
        howToPrepare,
        firstName,
        lastName,
      })))
);

const listOneRecipe = async (param) => {
  const recipeData = await dbGetSchema()
    .then((db) =>
      db
        .getTable('Recipes')
        .select(['id', 'recipe_name', 'ingredients', 'how_to_prepare', 'author_id'])
        .where('id = :id')
        .bind('id', param)
        .execute(),
    )
    .then((results) => results.fetchAll())
    .then((recipe) => recipe[0]);

  if (!recipeData) return null;

  const [id, recipeName, ingredients, howToPrepare, authorId] = recipeData;

  return { id, recipeName, ingredients, howToPrepare, authorId };
};

module.exports = {
  listRecipes,
  listOneRecipe,
};
