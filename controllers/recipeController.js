const recipeModel = require('../models/recipeModel');

const listRecipes = async (req, res) => {
  const recipes = await recipeModel.getAllRecipes();
  if (req.user) return res.render('home', { recipes });
  return res.render('non-authenticated/home', { recipes });
};

const showRecipe = async (req, res) => {
  const { id } = req.params;
  const recipe = await recipeModel.getSingleRecipe(id);
  if (req.user) return res.render('recipeDetails', { recipe, userId: req.user.id });
  return res.render('non-authenticated/recipeDetails', { recipe });
};

module.exports = {
  listRecipes,
  showRecipe,
};
