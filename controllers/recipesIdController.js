const RecipeId = require('../models/recipeIdModel');

const getRecipeInfo = async (req, res) => {
  const recipeDetails = await RecipeId.findRecipe(req.params.id);
  const id = req.user ? req.user.id : false;
  res.render('recipeDetail', { recipeDetails, id });
};

const newRecipePage = (_req, res) => {
  res.render('newRecipe', { err: false, success: false });
};

const createRecipe = async (req, res) => {
  const { recipeName, ingredients, howToPrepare } = req.body;
  if (!recipeName || !ingredients || !howToPrepare) {
    res.render('newRecipe', { err: true, success: false });
  }
  await RecipeId.createRecipe(req.user.id, recipeName, ingredients, howToPrepare);
  return res.render('newRecipe', { err: false, success: true });
};

module.exports = {
  getRecipeInfo,
  newRecipePage,
  createRecipe,
};
