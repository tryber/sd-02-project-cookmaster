const userController = require('./userController');
const recipesModel = require('../models/recipesModel')

const landingPage = async (_req, res) => {
  const recipesData = await recipesModel.readRecipes();
  return res.render('home', { recipesData });
}

const recipeDetails = async (req, res) => {
  return res.render('recipeDetails', { user: req.user, recipeID: req.params.id });
}

module.exports = {
  userController,
  landingPage,
  recipeDetails
};
