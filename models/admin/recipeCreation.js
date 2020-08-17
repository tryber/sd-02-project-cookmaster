const connection = require('../connection');

const addNewRecipe =  async (recipeData, userId) => {
  const { name, authorName, ingredients, description } = recipeData;
  const newRecipe = await connection().then((db) =>
    db
      .getTable('recipes')
      .insert(['name', 'recipe_description', 'author_alias'])
      .values([name, description, authorName])
      .execute()
      .then((results) => results.getAutoIncrementValue())
      .then((recipeId) => {
        const ingredientsArray = ingredients.split(',');
        return ingredientsArray.forEach((ingredient) => db
          .getTable('ingredients')
          .insert('ingredient_name')
          .value(ingredient)
          .execute()
          .then((results) => results.getAutoIncrementValue())
          .then((ingredientId) => db
            .getTable('recipes_ingredients')
            .insert(['recipe_id', 'ingredient_id'])
            .value([recipeId, ingredientId])
            .execute()
            .then(() => db
              .getTable('users_recipes')
              .insert(['user_id', 'recipe_id'])
              .values([userId, recipeId])
              .execute())));
      }));

  console.log(newRecipe);
  return newRecipe;
};

module.exports = {
  addNewRecipe,
};
