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

const compareIds = async (req, res) => {
  const { id: recipeId } = req.params;
  const recipe = await recipeModel.findIdRecipe(recipeId);
  const { authorId: authorId } = recipe;
  if (authorId === req.user.id) {
    return res.render('recipes/edit', { recipe, message: null, isLogged: req.user });
  }
  return res.redirect(`/recipes/${recipeId}`);
};

const editRecipe = async (req, res) => {
  const { name, ingredients, howToPrepare } = req.body;
  const { id: recipeId } = req.params;
  const { id: userId } = req.user;
  const recipe = await recipeModel.findIdRecipe(recipeId);
  const { authorId } = recipe;

  if (userId && userId === authorId) {
    await recipeModel.editRecipe(recipeId, name, ingredients, howToPrepare);
    return res.redirect(`/recipes/${recipeId}`);
  }
  res.redirect('/');
};

module.exports = {
  listRecipes,
  listOneRecipe,
  newRecipe,
  insertRecipe,
  compareIds,
  editRecipe,
};
