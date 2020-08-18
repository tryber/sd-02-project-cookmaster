const recipesModel = require('../models/recipesModel');
const recipesCRUDModel = require('../models/admin/recipesCRUDModel');

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

const newRecipesPage = async (_req, res) => res.render('admin/newRecipe', { message: '', redirect: false });

const createNewRecipe = async (req, res) => {
  const { id: userId } = req.user;
  const { body: recipeData } = req;
  const { message, redirect } = await recipesCRUDModel.addNewRecipe(recipeData, userId);
  if (redirect) res.render('admin/newRecipe', { message });
};

const modifyRecipePage = async (req, res) => {
  const { id: userId } = req.user;
  const recipeID = req.originalUrl.match(/[0-9]+/g);
  const recipeData = await recipesModel.readRecipes(Number(recipeID));
  if (!recipeData) return res.render('404').status(404);

  const {
    id, name, description, authorAlias, authorInfo, ingredients,
  } = recipeData;

  if (userId !== authorInfo.authorID) return res.redirect('/');
  return res.render('admin/editRecipe', { message: '', user: req.user, authorAlias, authorInfo, recipe: { id, name, description, ingredients } });
};

const modifyRecipe = async (req, res) => {
  const { id: userId } = req.user;
  const recipeId = Number(req.originalUrl.match(/[0-9]+/g)[0]);

  const { authorInfo: { authorID } } = await recipesModel.readRecipes(Number(recipeId));
  if (userId !== authorID) return res.redirect(`/recipes/${recipeId}`);

  const { body } = req;
  const recipeData = { recipeId, ...body };
  const updateRecipe = await recipesCRUDModel.updateRecipe(recipeData);
  return setTimeout(() => res.redirect(`/recipes/${recipeId}`), 2000);
};

module.exports = {
  recipesLandingPage,
  recipeDetails,
  newRecipesPage,
  createNewRecipe,
  modifyRecipePage,
  modifyRecipe,
};
