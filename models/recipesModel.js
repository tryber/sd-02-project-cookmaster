const connection = require('./connection');

async function getRecipes() {
  return connection()
    .then((db) =>
      db
        .getTable('recipes')
        .select(['id', 'user_id', 'user', 'name', 'ingredients', 'instructions'])
        .execute(),
    )
    .then((results) => results.fetchAll())
    .then((recipes) =>
      recipes.map(([recipeId, userId, userName, recipeName, ingredients, instructions]) => ({
        recipeId,
        userId,
        userName,
        recipeName,
        ingredients,
        instructions,
      })),
    );
}

module.exports = { getRecipes };
