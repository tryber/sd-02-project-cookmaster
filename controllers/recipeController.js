const recipeModel = require('../models/recipeModel');

const findRecipes = async (req, res) => {
  const recipes = await recipeModel.getRecipesFromDataBase();
  if (!recipes) return res.render('./404/notFound');
  res.render('./recipes/recipeView', { recipes, logged: req.user });
};

const findRecipeDetail = async (req, res) => {
  const { id } = req.params;
  const recipe = await recipeModel.getRecipeDetails(id);
  res.render('./recipes/recipeDetailsView', { recipe, logged: req.user || 'empty' });
}
module.exports = {
  findRecipes,
  findRecipeDetail,
};
