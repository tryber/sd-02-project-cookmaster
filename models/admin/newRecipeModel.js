const connection = require('../connection');

const addNewRecipe = async (recipeData, userId) => {
  const { name, authorName, ingredients, description } = recipeData;
  const newRecipe = await connection().then((db) =>
    db
      .getTable('recipes')
      .insert(['name', 'recipe_description', 'author_alias'])
      .values([name, description, authorName])
      .execute()
      .then((results) => results.getAutoIncrementValue())
      .then(async (recipeId) => {
        await db
          .getTable('users_recipes')
          .insert(['user_id', 'recipe_id'])
          .values([userId, recipeId])
          .execute();
        const ingredientsArray = ingredients.split(',').trim();
        return ingredientsArray.map((ingredient) => db
          .getTable('ingredients')
          .insert('ingredient_name')
          .values(ingredient)
          .execute()
          .then((results) => results.getAutoIncrementValue())
          .then((ingredientId) => db
            .getTable('recipes_ingredients')
            .insert(['recipe_id', 'ingredient_id'])
            .values([recipeId, ingredientId])
            .execute()));
      }));

  await Promise.all(newRecipe).then((results) => results);
  return newRecipe;
};

module.exports = {
  addNewRecipe,
};
