const connection = require('../connection');
const recipesModel = require('../recipesModel');

const searchByName = async (query) => {
  if (query === undefined) return null;

  const nameQuery = `%${query}%`;
  const searchResults = await connection().then((db) =>
    db
      .getTable('recipes')
      .select('id')
      .where('name like :nameQuery')
      .bind('nameQuery', nameQuery)
      .execute()
      .then((results) => results.fetchAll())
      .then((data) => data));

  if (searchResults.length === 0) return null;

  const promisesArray = searchResults.map(async ([id]) => recipesModel.readRecipes(id));
  const recipesArray = await Promise.all(promisesArray).then((results) => results);

  return recipesArray;
};

const searchByUserId = async (userId) => {
  const searchResults = await connection().then((db) =>
    db
      .getTable('users_recipes')
      .select('recipe_id')
      .where('user_id = :userId')
      .bind('userId', userId)
      .execute()
      .then((results) => results.fetchAll())
      .then((recipeIds) => recipeIds.map(async ([id]) => recipesModel.readRecipes(id))));

  if (searchResults.length === 0) return null;

  const recipesArray = await Promise.all(searchResults).then((results) => results);

  return recipesArray;
};

module.exports = {
  searchByName,
  searchByUserId,
};
