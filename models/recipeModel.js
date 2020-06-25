const useSession = require('./useSession');

const getAllRecipes = async () =>
  useSession()
    .then((session) => session
      .sql(`SELECT
            r.id,
            r.recipe_name AS recipeName,
            CONCAT(u.first_name, ' ', u.last_name) AS userName
            FROM
            recipes r
            INNER JOIN
            users u
            WHERE
            u.id = r.user_id;`)
      .execute())
    .then((results) => results.fetchAll())
    .then((recipes) =>
      recipes.map(([recipeId, recipeName, userName]) => ({ recipeId, recipeName, userName })));

const getSingleRecipe = async (idRecipe) =>
  useSession()
    .then((session) => session
      .sql(`SELECT
            r.id,
            r.user_id,
            r.recipe_name,
            r.ingredients,
            r.instructions,
            (SELECT CONCAT(u.first_name, ' ', u.last_name) FROM users u WHERE r.user_id = u.id)
            FROM recipes r
            WHERE r.id = ${idRecipe};`)
      .execute())
    .then((results) => results.fetchAll())
    .then((recipes) => {
      const [recipeId, userId, recipeName, ingredients, instructions, userName] = recipes[0];
      return { recipeId, userId, recipeName, ingredients, instructions, userName };
    });

const recipeAlreadyRegisteredByUser = async (userId, recipeName) =>
  useSession()
    .then((session) => session
      .sql('SELECT COUNT(recipe_name) FROM recipes WHERE user_id = ? AND recipe_name = ?')
      .bind(userId)
      .bind(recipeName)
      .execute())
    .then((results) => results.fetchAll())
    .then((recipeCount) => recipeCount[0][0]);

const updateRecipe = async (recipeData) => {
  const { recipe, ingredients, instructions, recipeId } = recipeData;
  return useSession()
    .then((session) =>
      session
        .sql(`UPDATE recipes
              SET
                recipe_name = ?,
                ingredients = ?,
                instructions = ?
              WHERE id = ?`)
        .bind(recipe)
        .bind(ingredients)
        .bind(instructions)
        .bind(recipeId)
        .execute());
};

module.exports = {
  getAllRecipes,
  getSingleRecipe,
  recipeAlreadyRegisteredByUser,
  updateRecipe,
};
