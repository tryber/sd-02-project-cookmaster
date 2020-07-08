const connection = require('./connection');
const getSchema = require('./getSchema');

const getNames = async () =>
  connection().then((session) =>
    session.sql(
      `SELECT r.id, r.name, u.first_name, u.last_name
      FROM project_cookmaster.recipes AS r
      INNER JOIN users AS u ON u.id = r.author_id;`,
    )
      .execute()
      .then((results) => results.fetchAll())
      .then((recipes) => recipes.map(
        ([recipeId, recipeName, userFirstName, userLastName]) =>
          ({ recipeId, recipeName, userFirstName, userLastName }
          ),
      )));

const findRecipesById = async (param) => {
  const recipeIdData = await getSchema().then((db) => db
    .getTable('recipes')
    .select(['id', 'name', 'ingredients', 'prepare_method', 'author_id'])
    .where('id = :id')
    .bind('id', param)
    .execute()
    .then((results) => results.fetchAll())
    .then((ids) => ids[0]));

  if (!recipeIdData) return null;

  const [id, name, ingredients, prepareMethod, authorId] = recipeIdData;

  return { id, name, ingredients, prepareMethod, authorId };
};

const isValid = (name, ingredients, prepareMethod) => {
  if (!name || typeof name !== 'string') return false;
  if (!ingredients || typeof ingredients !== 'string') return false;
  if (!prepareMethod || typeof prepareMethod !== 'string') return false;
  return true;
};

const insertRecipe = async (name, ingredients, prepareMethod, authorId) =>
  getSchema().then((db) =>
    db
      .getTable('recipes')
      .insert(['name', 'ingredients', 'prepare_method', 'author_id'])
      .values(name, ingredients, prepareMethod, authorId)
      .execute());

const editRecipe = async (recipeId, recipeName, recipeIngredients, recipePrepareMethod) =>
  connection().then((session) =>
    session.sql(
      `UPDATE project_cookmaster.recipes
      SET
        name = ?,
        ingredients = ?,
        prepare_method = ?
      WHERE id = ?;`,
    )
      .bind(recipeName)
      .bind(recipeIngredients)
      .bind(recipePrepareMethod)
      .bind(recipeId)
      .execute());

const deleteRecipe = async (param) =>
  getSchema().then((db) =>
    db
      .getTable('recipes')
      .delete()
      .where('id = :id')
      .bind('id', param)
      .execute());

const searchRecipes = async (param) =>
  connection().then((session) =>
    session.sql(
      `SELECT r.id, r.name, u.first_name, u.last_name
      FROM project_cookmaster.recipes AS r
      INNER JOIN users AS u ON u.id = r.author_id
      WHERE r.name REGEXP ?;`,
    )
      .bind(param)
      .execute())
    .then((results) => results.fetchAll())
    .then((recipes) =>
      recipes.map(([recipeId, recipeName, userFirstName, userLastName]) =>
        ({ recipeId, recipeName, userFirstName, userLastName }) || null));

module.exports = {
  getNames,
  findRecipesById,
  isValid,
  insertRecipe,
  editRecipe,
  deleteRecipe,
  searchRecipes,
};
