const connection = require('./connection');
const userModel = require('./userModel');

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

async function find({ key, value }) {
  return connection()
    .then((db) =>
      db
        .getTable('recipes')
        .select(['id', 'user_id', 'user', 'name', 'ingredients', 'instructions'])
        .where(`${key} = :${key}`)
        .bind(key, value)
        .execute(),
    )
    .then((results) => results.fetchAll());
}

async function findRecipe({ key, value }) {
  const recipeData = await find({ key, value }).then((recipe) => recipe[0]);

  if (!recipeData) return null;

  const [recipeId, userId, userName, recipeName, ingredients, instructions] = recipeData;

  return {
    recipeId,
    userId,
    userName,
    recipeName,
    ingredients,
    instructions,
  };
}

async function findRecipes({ key, value }) {
  const recipesData = await find({ key, value });

  if (!recipesData) return null;

  return recipesData.map(([recipeId, userId, userName, recipeName, ingredients, instructions]) => ({
    recipeId,
    userId,
    userName,
    recipeName,
    ingredients,
    instructions,
  }));
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
    db
      .getTable('recipes')
      .delete()
      .where('id = :id')
      .bind('id', recipeId)
      .execute(),
  );

  return true;
}

module.exports = { getRecipes, findRecipe, createRecipe, updateRecipe, deleteRecipe, findRecipes };
