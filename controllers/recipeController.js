const recipeModel = require('../models/recipeModel');

const findRecipes = async (req, res) => {
  const recipes = await recipeModel.getRecipesFromDataBase('recipes');
  if (!recipes) return res.render('./404/notFound');
  res.render('./recipes/recipeView', { message: null, recipe: recipes });
};

module.exports = {
  findRecipes,
};
