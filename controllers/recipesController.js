const recipesModel = require('../models/recipesModel');
const recipesCRUDModel = require('../models/admin/recipesCRUDModel');
const recipeSearchModels = require('../models/admin/recipeSearchModel');

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
  await recipesCRUDModel.updateRecipe(recipeData);
  return setTimeout(() => res.redirect(`/recipes/${recipeId}`), 2000);
};

const deleteRecipePage = async (req, res) => {
  const { id: userId } = req.user;
  const recipeId = Number(req.originalUrl.match(/[0-9]+/g)[0]);
  const { authorInfo: { authorID } } = await recipesModel.readRecipes(Number(recipeId));
  if (userId !== authorID) return res.redirect(`/recipes/${recipeId}`);

  return res.render('admin/deleteRecipe', { message: '', recipeId });
};

const deleteRecipe = async (req, res) => {
  const { id: userId } = req.user;
  const { body: { deletePassword } } = req;
  const recipeId = Number(req.originalUrl.match(/[0-9]+/g)[0]);

  const { redirect } = await recipesCRUDModel.deleteRecipe(recipeId, userId, deletePassword);

  if (redirect) return res.redirect('/');
  return res.render('admin/deleteRecipe', { message: 'Senha incorreta. Por favor, tente novamente.', recipeId });
};

const recipeSearchPage = async (req, res) => {
  const { query: { q } } = req;
  const recipesData = await recipeSearchModels.searchByName(q);
  return res.render('admin/searchRecipes', { recipesData });
};

module.exports = {
  recipesLandingPage,
  recipeDetails,
  newRecipesPage,
  createNewRecipe,
  modifyRecipePage,
  modifyRecipe,
  deleteRecipePage,
  deleteRecipe,
  recipeSearchPage,
};
