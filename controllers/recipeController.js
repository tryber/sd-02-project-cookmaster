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

const showEditRecipe = async (req, res) => {
  const { id: recipeId } = req.params;
  const recipe = await recipeModel.findRecipesById(recipeId);
  const { authorId: recipeAuthorId } = recipe;
  if (recipeAuthorId === req.user.id) {
    return res.render('recipes/edit', { recipe, message: null, isLogged: req.user });
  }
  return res.redirect(`/recipes/${recipeId}`);
};

const editRecipe = async (req, res) => {
  const { name, ingredients, prepareMethod } = req.body;
  const { id: recipeId } = req.params;
  const { id: userId } = req.user;
  const recipe = await recipeModel.findRecipesById(recipeId);
  const { authorId } = recipe;

  if (userId && userId === authorId) {
    await recipeModel.editRecipe(recipeId, name, ingredients, prepareMethod);
    return res.redirect(`/recipes/${recipeId}`);
  }
  res.redirect('/');
};

const showDeleteRecipe = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const recipe = await recipeModel.findRecipesById(id);
  console.log(recipe);
  res.render('recipes/delete', { message: null, isLogged: req.user });
};

const deleteRecipe = async (req, res) => {
  res.redirect('/');
};

module.exports = {
  listRecipeNameAuthors,
  showRecipe,
  newRecipe,
  insertRecipe,
  showEditRecipe,
  editRecipe,
  showDeleteRecipe,
  deleteRecipe,
};
