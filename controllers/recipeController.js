const Recipe = require('../models/recipeModel');

const listRecipes = async (req, res) => {
  const recipes = await Recipe.getAll();

  res.render('home', { recipes, user: req.user });
};

const showRecipeDetails = async (req, res) => {
  const idFromUrl = req.url.split('/')[2];

  const recipe = await Recipe.getById(idFromUrl);


  res.render('details', { recipe, user: req.user });
};

module.exports = {
  listRecipes,
  showRecipeDetails,
};
