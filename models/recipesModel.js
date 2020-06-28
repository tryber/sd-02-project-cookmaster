const connection = require('./connection');

async function findRecipe(id) {
  const recipeData = await connection()
    .then((db) =>
      db
        .getTable('recipes')
        .select(['id', 'user_id', 'user', 'name', 'ingredients', 'instructions'])
        .where('id = :id')
        .bind('id', id)
        .execute(),
    )
    .then((results) => results.fetchAll())
    .then((recipe) => recipe[0]);

  if (!recipeData) return null;

  const [recipeId, userId, userName, recipeName, ingredients, instructions] = recipeData;

  return {
    recipeId,
    userId,
    userName,
    recipeName,
    ingredients: ingredients.split(' '),
    instructions,
  };
}

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

async function createRecipe({ id: userId, fullName, name, ingredients, instructions }) {
  return connection().then((db) =>
    db
      .getTable('recipes')
      .insert(['user_id', 'user', 'name', 'ingredients', 'instructions'])
      .values(userId, fullName, name, ingredients, instructions)
      .execute(),
  );
}

module.exports = { getRecipes, findRecipe, createRecipe };
