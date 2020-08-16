const connection = require('./connections');

/**
 * Captura os títulos de todas as receitas no banco
 */

const queryUser = `SELECT
re.recipe_id, re.recipe_name, CONCAT(us.first_name, ' ', us.last_name)
FROM recipes AS re
INNER JOIN users AS us ON us.id = re.insert_user;`;

const getNames = async () =>
  connection().then((session) =>
    session.sql(queryUser)
      .execute()
      .then((results) => results.fetchAll())
      .then((recipes) =>
        recipes.map(
          ([id, recipe, userName]) =>
            ({ id, recipe, userName }),
        )));

/**
 * Retorna a receita completa de acordo com o ID
 * @param {number} id ID da receita a ser retornada
 */

const queryRecipe = `SELECT
fs.recipe_name, fs.ingredients, fs.process_recipe, CONCAT(us.first_name, ' ', us.last_name), us.id
FROM (SELECT recipe_name, ingredients, process_recipe, insert_user
FROM recipes
WHERE recipe_id = ?) AS fs
INNER JOIN users AS us ON fs.insert_user = us.id;`;

const getRecipe = async (id) =>
  connection().then((session) =>
    session.sql(queryRecipe)
      .bind(id)
      .execute())
    .then((results) => results.fetchAll()[0])
    .then(([title, ingredients, detailsRecipe, userName, idUser]) =>
      ({ title, ingredients, detailsRecipe, userName, idUser }));

const insertRecipe = async ({ title, ing, proc, id }) =>
  connection()
    .then((db) =>
      db
        .getSchema('cookmaster')
        .getTable('recipes')
        .insert(['recipe_name', 'ingredients', 'process_recipe', 'insert_user'])
        .values([title, ing, proc, id])
        .execute(),
    );

const createRecipe = async ({ title, ingredients, detailsRecipe }, user) => {
  if (!title || !ingredients || !detailsRecipe) return { message: 'Preencha todos os campos.' };
  const toInsert = { title, ing: ingredients, proc: detailsRecipe, id: user };
  const id = await insertRecipe(toInsert)
    .then((result) => result.getAutoIncrementValue());
  return { message: 'Receita cadastrada.', id };
};

const updateQuery = `UPDATE recipes
SET recipe_name = ?, ingredients = ?, process_recipe = ?
WHERE recipe_id = ?;`;

const updateRecipe = async ({ title, ingredients, detailsRecipe, id }) =>
  connection()
    .then((session) =>
      session
        .sql(updateQuery)
        .bind(title)
        .bind(ingredients)
        .bind(detailsRecipe)
        .bind(id)
        .execute());

const deleteRecipeQuery = 'DELETE from recipes WHERE recipe_id=?';

const deleteRecipe = async (recipeId) =>
  connection()
    .then((session) =>
      session
        .sql(deleteRecipeQuery)
        .bind(recipeId)
        .execute());

const recipeLike = `SELECT
re.recipe_id, re.recipe_name, CONCAT(us.first_name, ' ', us.last_name) FROM recipes as re
INNER JOIN users as us on us.id = re.insert_user
WHERE re.recipe_name LIKE ?;`;

const getRecipeLike = async (string) => {
  const likeWord = `%${string}%`;
  return connection()
    .then((session) =>
      session
        .sql(recipeLike)
        .bind(likeWord)
        .execute()
        .then((results) => results.fetchAll())
        .then((recipes) => recipes
          .map(([id, title, user]) => ({ id, title, user }))),
    );
};

const getUserRecipesQuery = `SELECT
re.recipe_id,
re.recipe_name,
CONCAT(us.first_name, ' ', us.last_name)
FROM recipes as re
INNER JOIN users as us on us.id = re.insert_user
WHERE re.insert_user = ?;`;

const getUserRecipes = (id) =>
  connection()
    .then((session) =>
      session
        .sql(getUserRecipesQuery)
        .bind(id)
        .execute()
        .then((results) => results.fetchAll())
        .then((recipes) => recipes
          .map(([userId, title, user]) => ({ id: userId, title, user })),
        ));


module.exports = {
  getNames,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeLike,
  getUserRecipes,
};
