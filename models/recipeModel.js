const { dbLogin } = require('./connection');
// buscando as receitas no banco, retornando todas as cadastradas.
const listRecipes = () => (
  dbLogin()
    .then((db) => db.sql(
      `SELECT
      r.id,
      r.recipe_name,
      r.ingredients,
      r.how_to_prepare,
      u.first_name,
      u.last_name
      FROM Recipes as r
      INNER JOIN Users as u
      ON u.id = r.author_id`
    ).execute())
    .then((results) => results.fetchAll())
    .then((recipes) => recipes.map(([id, recipeName, ingredients, howToPrepare, firstName, lastName]) => ({
      id,
      recipeName,
      ingredients,
      howToPrepare,
      firstName,
      lastName
    })))
);

module.exports = {
  listRecipes
};
