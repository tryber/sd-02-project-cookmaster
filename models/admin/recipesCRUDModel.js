const connection = require('../connection');

const formatIngredients = (ingredientsArray) => {
  const formattedArray = ingredientsArray.split(',');
  return formattedArray.map((ingredient) => `${ingredient}`.trim())
    .filter((ingredient) => !ingredient.includes(' ') && ingredient !== undefined && ingredient !== '');
};

const addNewRecipe = async (recipeData, userId) => {
  const { name, authorName, ingredients, description } = recipeData;
  const ingredientsArray = formatIngredients(ingredients);
  const newRecipe = await connection().then((db) =>
    db
      .getTable('recipes')
      .insert(['name', 'recipe_description', 'author_alias'])
      .values([name, description, authorName])
      .execute()
      .then((results) => results.getAutoIncrementValue())
      .then((recipeId) => db
        .getTable('users_recipes')
        .insert(['user_id', 'recipe_id'])
        .values([userId, recipeId])
        .execute()
        .then(() => ingredientsArray.map((ingredient) => db
          .getTable('ingredients')
          .insert('ingredient_name')
          .values(ingredient)
          .execute()
          .then((results) => results.getAutoIncrementValue())
          .then((ingredientId) => db
            .getTable('recipes_ingredients')
            .insert(['recipe_id', 'ingredient_id'])
            .values([recipeId, ingredientId])
            .execute())))));

  const status = await Promise.all(newRecipe).then((results) => results);
  const errorCount = status.reduce((acc, stats) => acc + stats.getWarnings().length, 0);
  if (errorCount === 0) return { message: 'Receita criada com sucesso', redirect: true };
  return { message: 'Algo deu errado...', redirect: false };
};

const updateRecipe = async (recipeData) => {
  const { recipeId, name, description, ingredients } = recipeData;
  const ingredientsArray = formatIngredients(ingredients);

  const updatedRecipes = await connection().then((db) =>
    db
      .getTable('recipes')
      .update()
      .where('id = :recipeId')
      .bind('recipeId', recipeId)
      .set('name', name)
      .set('recipe_description', description)
      .execute()
      .then(() => db
        .getTable('recipes_ingredients')
        .delete()
        .where('recipe_id = :recipeId')
        .bind('recipeId', recipeId)
        .execute())
      .then(() => ingredientsArray.map((ingredient) => db
        .getTable('ingredients')
        .insert('ingredient_name')
        .values(ingredient)
        .execute()
        .then((results) => results.getAutoIncrementValue())
        .then((ingredientId) => db
          .getTable('recipes_ingredients')
          .insert(['recipe_id', 'ingredient_id'])
          .values([recipeId, ingredientId])
          .execute()))));

  await Promise.all(updatedRecipes);
};

module.exports = {
  addNewRecipe,
  updateRecipe,
};
