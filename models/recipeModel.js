const { getSession } = require('./connection');

const getRecipesFromDataBase = async () => {
  const session = await getSession();
  const results = await
  session.sql(
      `SELECT r.id, r.name, u.name, u.last_name
      FROM cookmaster.recipes AS r
      INNER JOIN users AS u ON u.id = r.author_id;`,
    )
    .execute()
    .then((executeResult) => executeResult.fetchAll())
    .then((recipeResult) => {
      if (!recipeResult) return null;
      return recipeResult.map(
        ([id, recipeName, userName, userLastName]) => ({
          id,
          recipeName,
          userName,
          userLastName,
        }),
      );
    });
  return results;
};

const getRecipeDetails = async (paramId) => {
  const session = await getSession();
  const results = await
  session.sql(
      `SELECT id, name, ingredients, prepare_method, author_id
      FROM recipes
      WHERE id = ?;`,
    )
    .bind(paramId)
    .execute()
    .then((recipeResults) => recipeResults.fetchAll())
    .then((recipeDetail) => recipeDetail[0]);
  if (!results) return null;
  const [id, name, ingredients, prepareMethod, authorId] = results;
  return { id, name, ingredients, prepareMethod, authorId };
};

const createRecipe = async (query) => {
  const session = await getSession();
  return session.sql(query).execute();
};

const editRecipe = async (query) => {
  const session = await getSession();
  return session.sql(query).execute();
}

module.exports = {
  getRecipesFromDataBase,
  getRecipeDetails,
  createRecipe,
  editRecipe,
};
