const recipeModel = require('../models/recipeModel');

const listRecipeNameAuthors = async (req, res) => {
  const recipes = await recipeModel.getNames();
  res.render('home', { recipes, isLogged: req.user });
};

const newRecipe = async (req, res) => {
  res.render('recipes/new', { placeholder: null, isLogged: req.user || {} });
};

const showRecipe = async (req, res) => {
  const { id } = req.params;
  const recipe = await recipeModel.findRecipesById(id);
  console.log('old', req.user);
  res.render('recipes/show', { recipe, isLogged: req.user || {} });
};

module.exports = { listRecipeNameAuthors, newRecipe, showRecipe };
