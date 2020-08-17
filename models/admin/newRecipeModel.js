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
        const ingredientsArray = ingredients.split(',');
        ingredientsArray.map((ingredient) => ingredient.trim());
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

  const status = await Promise.all(newRecipe).then((results) => results);
  const errorCount = status.reduce((acc, stats) => acc + stats.getWarnings().length, 0);
  if (errorCount === 0) return { message: 'Receita criada com sucesso', redirect: true };
  return { message: 'Algo deu errado...', redirect: false };
};

module.exports = {
  addNewRecipe,
};
