const connection = require('./connection');

const fetchRecipesIngredients = async (recipeData) => {
  const { id, name, description, authorAlias, authorInfo: { authorID, fullName } } = recipeData;
  const ingredientsData = await connection().then((db) =>
    db
      .getTable('recipes_ingredients').select('ingredient_id').where('recipe_id = :recipeData_id').bind('recipeData_id', recipeData.id)
      .execute()
      .then((results) => results.fetchAll())
      .then((data) => data.map(([ingredientID]) =>
        db
          .getTable('ingredients').select('ingredient_name').where('ingredient_id = :ingredientID').bind('ingredientID', ingredientID)
          .execute()
          .then((results) => results.fetchAll())
          .then(([[ingredientNames]]) => ingredientNames))));
  const ingredientNames = await Promise.all(ingredientsData).then(([...results]) => results);

  return {
    id,
    name,
    description,
    authorAlias,
    authorInfo: { authorID, fullName },
    ingredients: ingredientNames,
  };
};

const fetchRecipeWithAuthor = async (recipesData) => {
  const recipesWithAuthor = recipesData.map(([id, name, description, authorAlias]) =>
    connection().then((db) =>
      db
        .getTable('users_recipes').select('user_id').where('recipe_id = :id').bind('id', id)
        .execute())
      .then((results) => results.fetchAll())
      .then(([[userID]]) =>
        connection().then((db) =>
          db
            .getTable('users').select(['id', 'name', 'last_name']).where('id = :userID').bind('userID', userID)
            .execute()))
      .then((results) => results.fetchAll())
      .then(([authorInfo]) => fetchRecipesIngredients(
        { id, name, description, authorAlias, authorInfo: { authorID: authorInfo[0], fullName: `${authorInfo[1]} ${authorInfo[2]}` } },
      )));
  const recipesArray = await Promise.all(recipesWithAuthor).then((results) => results);
  return recipesArray;
};

const readRecipes = async (recipeID) => {
  const recipes = await connection().then((db) =>
    db
      .getTable('recipes').select(['id', 'name', 'recipe_description', 'author_alias'])
      .execute())
    .then((results) => results.fetchAll())
    .then((data) => fetchRecipeWithAuthor(data));

  if (recipeID) return recipes.filter(({ id }) => id === recipeID)[0];

  return recipes;
};

module.exports = {
  readRecipes,
};
