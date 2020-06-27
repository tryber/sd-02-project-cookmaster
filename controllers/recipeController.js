const recipeModel = require('../models/recipeModel');
// devolvendo os dados para a view. Aqui eu renderizo o arquivo HOME com informações

const listRecipes = async (_req, res) => {
  const recipes = await recipeModel.listRecipes();
  res.render('home', {recipes})
};

module.exports = {
  listRecipes,
};
