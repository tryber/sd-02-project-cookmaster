const userController = require('./userController');
const recipesModel = require('../models/recipesModel')

const landingPage = async (_req, res) => {
  const recipesData = await recipesModel.readRecipes();
  return res.render('home', { recipesData });
}

module.exports = {
  userController,
  landingPage
};
