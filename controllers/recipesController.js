const recipesModel = require('../models/recipesModel');
const newRecipeModel = require('../models/admin/newRecipeModel');

const recipesLandingPage = async (_req, res) => {
  const recipesData = await recipesModel.readRecipes();
  return res.render('home', { recipesData });
};

const recipeDetails = async (req, res) => {
  const recipeID = req.originalUrl.match(/[0-9]+/g);
  const recipeData = await recipesModel.readRecipes(Number(recipeID));
  if (!recipeData) return res.render('404');
  const {
    id, name, description, authorAlias, authorInfo, ingredients,
  } = recipeData;

  return res.render('recipeDetails', { user: req.user, authorAlias, authorInfo, recipe: { id, name, description, ingredients } });
};

const newRecipesPage = async (_req, res) => res.render('admin/newRecipe', { message: 'test', redirect: false });

const createNewRecipe = async (req, res) => {
  const { id: userId } = req.user;
  const { body: recipeData } = req;
  const newRecipe = await newRecipeModel.addNewRecipe(recipeData, userId);
  console.log(newRecipe);
  res.render('admin/newRecipe', { message: 'Criado', redirect: false });
};

module.exports = {
  recipesLandingPage,
  recipeDetails,
  newRecipesPage,
  createNewRecipe,
};
