const connection = require('./connection');
const userModel = require('./userModel');

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

async function searchRecipe(recipeId) {
  const recipeData = await connection()
    .then((db) =>
      db
        .getTable('recipes')
        .select(['id', 'name', 'ingredients', 'instructions'])
        .where('id = :id')
        .bind('id', recipeId)
        .execute(),
    )
    .then((results) => results.fetchAll())
    .then((recipe) => recipe[0]);

  if (!recipeData) return null;

  const [id, name, ingredients, instructions] = recipeData;

  return { name, ingredients, instructions, id };
}

async function updateRecipe({ id, name, ingredients, instructions }) {
  return connection().then((db) =>
    db
      .getTable('recipes')
      .update()
      .set('name', name)
      .set('ingredients', ingredients)
      .set('instructions', instructions)
      .where('id = :id')
      .bind('id', id)
      .execute(),
  );
}

async function deleteRecipe({ recipeId, userId, password }) {
  const { password: userPassword } = await userModel.findUser({ key: 'id', value: userId });

  if (password !== userPassword) return false;

  await connection().then((db) =>
    db.getTable('recipes')
      .delete()
      .where('id = :id')
      .bind('id', recipeId)
      .execute(),
  );

  return true;
}

module.exports = { getRecipes, findRecipe, createRecipe, searchRecipe, updateRecipe, deleteRecipe };
