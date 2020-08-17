const recipesModel = require('../models/recipesModel');
const recipeCreation = require('../models/admin/recipeCreation');

const recipesLandingPage = async (_req, res) => {
  const recipesData = await recipesModel.readRecipes();
  return res.render('home', { recipesData });
};

const recipeDetails = async (req, res) => {
  const recipeID = req.originalUrl.match(/[0-9]+/g);
  const {
    id, name, description, authorAlias, authorInfo, ingredients,
  } = await recipesModel.readRecipes(Number(recipeID));
  return res.render('recipeDetails', { user: req.user, authorAlias, authorInfo, recipe: { id, name, description, ingredients } });
};

const newRecipesPage = async (_req, res) => res.render('admin/newRecipe', { message: 'test', redirect: false });

const createNewRecipe = async (req, res) => {
  const { id: userId } = req.user;
  const { body: recipeData } = req;
  const newRecipe = await recipeCreation.addNewRecipe(recipeData, userId);
  console.log(newRecipe);
  res.render('admin/newRecipe', { message: 'Criado', redirect: false });
};

module.exports = {
  recipesLandingPage,
  recipeDetails,
  newRecipesPage,
  createNewRecipe,
};
