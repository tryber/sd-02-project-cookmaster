const recipesModel = require('../models/recipesModel')

const recipesLandingPage = async (_req, res) => {
  const recipesData = await recipesModel.readRecipes();
  return res.render('home', { recipesData });
}

const recipeDetails = async (req, res) => {
  const recipeID = req.params.id;
  const  { id, name, description, ingredients } = await recipesModel.readRecipes(Number(recipeID));
  // console.log({ id, name, description, ingredients })
  return res.render('recipeDetails', { user: req.user, recipe: { id, name, description, ingredients } });
}

module.exports = {
  recipesLandingPage,
  recipeDetails
};
