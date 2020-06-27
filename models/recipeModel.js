const useSession = require('./useSession');
const connection = require('./connection');

const getAllRecipes = async () =>
  useSession()
    .then((session) => session
      .sql(`SELECT
            r.id,
            r.recipe_name,
            CONCAT(u.first_name, ' ', u.last_name)
            FROM
            recipes r
            INNER JOIN
            users u
            ON
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

const registerNewRecipe = async (newRecipeData) => {
  const { recipe, ingredients, instructions, userId } = newRecipeData;
  return connection()
    .then((database) => database
      .getTable('recipes')
      .insert(['recipe_name', 'ingredients', 'instructions', 'user_id'])
      .values(recipe, ingredients, instructions, userId)
      .execute());
};

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

const deleteRecipeFromTable = async (recipeId) =>
  connection()
    .then((database) =>
      database
        .getTable('recipes')
        .delete()
        .where('id = :recipeId')
        .bind('recipeId', recipeId)
        .execute());

const findRecipes = async (searchTerm) =>
  useSession()
    .then((session) => session
      .sql(`SELECT
        r.id,
        r.recipe_name,
        CONCAT(u.first_name, ' ', u.last_name)
        FROM
        recipes r
        INNER JOIN
        users u
        ON
        u.id = r.user_id
        AND
        r.recipe_name REGEXP ?;`)
      .bind(searchTerm)
      .execute())
    .then((results) => results.fetchAll())
    .then((recipes) =>
      recipes.map(([recipeId, recipeName, userName]) =>
        ({ recipeId, recipeName, userName }) || null));

const getUserRecipes = (userId) =>
  useSession()
    .then((session) => session
      .sql(`SELECT
            r.id,
            r.recipe_name,
            CONCAT(u.first_name, ' ', u.last_name)
            FROM
            recipes r
            INNER JOIN
            users u
            ON
            u.id = r.user_id
            AND
            r.user_id = ?;`)
      .bind(userId)
      .execute())
    .then((results) => results.fetchAll())
    .then((recipes) =>
      recipes.map(([recipeId, recipeName, userName]) =>
        ({ recipeId, recipeName, userName } || null)));

module.exports = {
  getAllRecipes,
  getSingleRecipe,
  recipeAlreadyRegisteredByUser,
  registerNewRecipe,
  updateRecipe,
  deleteRecipeFromTable,
  findRecipes,
  getUserRecipes,
};
