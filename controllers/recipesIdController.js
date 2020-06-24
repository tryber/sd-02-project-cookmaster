const RecipeId = require('../models/recipeIdModel');

const getRecipeInfo = async (req, res) => {
  const recipeDetails = await RecipeId.findRecipe(req.params.id);
  const id = req.user ? req.user.id : false;
  console.log(id);
  console.log(recipeDetails);
  res.render('recipeDetail', { recipeDetails, id });
};

module.exports = {
  getRecipeInfo,
};
