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

const newRecipe = async (req, res) => {
  res.render('recipes/new', { message: null, isLogged: req.user });
};

const insertRecipe = async (req, res) => {
  const { recipe_name, ingredients, how_to_prepare } = req.body;
  const { id } = req.user;

  if (!recipeModel.verifyInputs(recipe_name, ingredients, how_to_prepare)) {
    return res.render('recipes/new', { message: 'Dados inválidos', isLogged: req.user });
  }

  await recipeModel.insertRecipe(recipe_name, ingredients, how_to_prepare, id);
  res.redirect('/');
};

module.exports = {
  listRecipes,
  listOneRecipe,
  newRecipe,
  insertRecipe,
};
