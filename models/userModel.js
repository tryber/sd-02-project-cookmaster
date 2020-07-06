const { connection, schema } = require('./connections');

/* Substitua o código das funções abaixo para que ela,
de fato, realize a busca no banco de dados */

/**
 * Busca um usuário através do seu email e, se encontrado, retorna-o.
 * @param {string} email Email do usuário a ser encontrado
 */

const findByEmail = async (email) => {
  const user = await schema()
    .then((db) =>
      db
        .getTable('users')
        .select(['id', 'email', 'pass', 'first_name', 'last_name'])
        .where('email = :email')
        .bind('email', email)
        .execute())
    .then((results) => results.fetchAll())
    .then((value) => ({
      id: value[0][0],
      email: value[0][1],
      password: value[0][2],
      name: value[0][3],
      lastName: value[0][4],
    }));
  return user;
};

/**
 * Busca um usuário através do seu ID
 * @param {string} id ID do usuário
 */
const findById = async (id) => {
  const db = await schema();
  const data = await db
    .getTable('users')
    .select(['id', 'email', 'pass', 'first_name', 'last_name'])
    .where('id = :id')
    .bind('id', id)
    .execute();

  const user = await data.fetchAll();
  return {
    id: user[0][0],
    email: user[0][1],
    password: user[0][2],
    name: user[0][3],
    lastName: user[0][4],
  };
};

const getAll = async () => (
  connection()
    .then((db) =>
      db
        .sql(
          `SELECT rcp.id, rcp.recipe_name, us.first_name FROM recipes as rcp
          INNER JOIN users as us ON us.id = rcp.author_id;`,
        )
        .execute())
    .then((results) => results.fetchAll())
);

const getRecipeDetails = (id) => (
  schema()
    .then((db) =>
      db
        .getTable('recipes')
        .select(['id', 'recipe_name', 'ingredients', 'recipe', 'author_id'])
        .where('id = :id')
        .bind('id', id)
        .execute())
    .then((results) => results.fetchAll())
);

const createNewUser = (firstName, lastName, email, pass) => {
  schema()
    .then((db) =>
      db
        .getTable('users')
        .insert(['first_name', 'last_name', 'email', 'pass'])
        .values(firstName, lastName, email, pass)
        .execute());
};

const createNewRecipe = (recipeName, ingredients, recipe, authorId) => {
  schema()
    .then((db) =>
      db
        .getTable('recipes')
        .insert(['recipe_name', 'ingredients', 'recipe', 'author_id'])
        .values(recipeName, ingredients, recipe, authorId)
        .execute());
};

const updateRecipe = (recipeName, ingredients, recipe, id) => (
  connection()
    .then((db) =>
      db
        .sql(`UPDATE recipes
          SET
          recipe_name = ?,
          ingredients = ?,
          recipe = ?
          WHERE id = ?;`)
        .bind(recipeName)
        .bind(ingredients)
        .bind(recipe)
        .bind(id)
        .execute())
);

/* const getRecipeDetails = (id) => {
  return schema()
    .then((db) =>
      db
      .getTable('recipes')
      .select(['id', 'recipe', 'author_id'])
      .execute()
    )
    .then((results) => results.fetchAll())
} */

module.exports = {
  findByEmail,
  findById,
  getAll,
  getRecipeDetails,
  createNewUser,
  createNewRecipe,
  updateRecipe,
};
