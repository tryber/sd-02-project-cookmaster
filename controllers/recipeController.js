const recipeModel = require('../models/recipeModel');
// devolvendo os dados para a view. Aqui eu renderizo o arquivo HOME com informações

const listRecipes = async (req, res) => {
  const recipes = await recipeModel.listRecipes();
  const loggedIn = req.user || null;
  res.render('home', {recipes, loggedIn})
};

// const showRecipe = async (req, res) => {
//   const { id } = req.params;
//   const recipe = await recipeModel.findById(id);

//   if (!recipe) return res.status(404).render('404');

//   res.render('recipes/show', { recipe });
// };

module.exports = {
  listRecipes,
//  showRecipe
};
