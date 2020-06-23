const { getSession } = require('./connection');

const GET_ALL_RECIPES_QUERY =
  `SELECT r.id, r.recipe_name, (CONCAT(first_name, ' ', u.last_name)) creator_name
FROM Recipes r
INNER JOIN Users u ON u.id = r.creator_id;`;

const findAllRecipes = async () => {
  const db = await getSession();
  const sesions = await db.sql(GET_ALL_RECIPES_QUERY).execute();
  const recipes = await sesions.fetchAll();
  return recipes;
};

module.exports = {
  findAllRecipes,
};
