const recipeModel = require('../models/recipeModel');

const listRecipeNameAuthors = async (req, res) => {
  const recipes = await recipeModel.getNames();
  res.render('home', { recipes, isLogged: req.user });
};

const showRecipe = async (req, res) => {
  const { id } = req.params;
  const recipe = await recipeModel.findRecipesById(id);
  res.render('recipes/show', { recipe, isLogged: req.user || {} });
};

const newRecipe = async (req, res) => {
  res.render('recipes/new', { message: null, isLogged: req.user });
};

const insertRecipe = async (req, res) => {
  const { name, ingredients, prepareMethod } = req.body;
  const { id } = req.user;

  if (!recipeModel.isValid(name, ingredients, prepareMethod)) {
    return res.render('recipes/new', { message: 'Dados inválidos', isLogged: req.user });
  }

  await recipeModel.insertRecipe(name, ingredients, prepareMethod, id);
  res.redirect('/');
};

module.exports = { listRecipeNameAuthors, showRecipe, newRecipe, insertRecipe };
