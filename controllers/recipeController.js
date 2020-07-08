const recipeModel = require('../models/recipeModel');
// devolvendo os dados para a view. Aqui eu renderizo o arquivo HOME com informações

const listRecipes = async (req, res) => {
  const recipes = await recipeModel.listRecipes();
  const loggedIn = req.user || null;
  res.render('home', { recipes, loggedIn });
};

const listOneRecipe = async (req, res) => {
  const { id } = req.params;
  const recipe = await recipeModel.listOneRecipe(id);
  const loggedIn = req.user || null;
  res.render('recipes/show', { recipe, loggedIn });
};

module.exports = {
  listRecipes,
  listOneRecipe,
};
