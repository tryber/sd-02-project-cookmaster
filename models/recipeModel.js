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
    .select(['name', 'ingredients', 'prepare_method', 'author_id'])
    .where('id = :id')
    .bind('id', param)
    .execute()
    .then((results) => results.fetchAll())
    .then((ids) => ids[0]));

  if (!recipeIdData) return null;

  const [name, ingredients, prepareMethod, authorId] = recipeIdData;

  return { name, ingredients, prepareMethod, authorId };
};

module.exports = { getNames, findRecipesById };
