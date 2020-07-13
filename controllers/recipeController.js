const recipeModel = require('../models/recipeModel');
const userModel = require('../models/userModel');

const findRecipes = async (req, res) => {
  const recipes = await recipeModel.getRecipesFromDataBase();
  if (!recipes) return res.render('./404/notFound');
  res.render('./recipes/recipeView', { recipes, logged: req.user, message: null });
};

const findRecipeDetail = async (req, res) => {
  const { id } = req.params;
  const recipe = await recipeModel.getRecipeDetails(id);
  return res.render('./recipes/recipeDetailsView', { recipe, logged: req.user || 'empty' });
};

const verifyNewRecipeForm = async (req, res) => {
  const { id } = req.user;
  const { name, ingredients, prepareMethod } = req.body;

  if (id && name && ingredients && prepareMethod) {
    await recipeModel.createRecipe(name, ingredients, prepareMethod, id);
    const recipes = await recipeModel.getRecipesFromDataBase();
    return res.render('./recipes/recipeView',
      { recipes, message: 'Receita criada com sucesso', logged: req.user || 'empty' });
  }
  return res.render('./recipes/newRecipe', { message: 'Preencha todos os campos' });
};

const loginRecipeEdit = async (req, res) => {
  const { id } = req.params;
  const recipe = await recipeModel.getRecipeDetails(id);
  if (recipe.authorId !== req.user.id) {
    return res.redirect(`/recipes/${id}`);
  }
  res.status(200).render('./recipes/editRecipe', { recipe, message: null });
};

const editRecipeController = async (req, res) => {
  const { id } = req.user;
  const { id: recipeId } = req.params;
  const { name, ingredients, prepareMethod } = req.body;
  let recipe = await recipeModel.getRecipeDetails(recipeId);
  if (id && name && ingredients && prepareMethod) {
    await recipeModel.editRecipe(name, ingredients, prepareMethod, recipeId, id);
    recipe = await recipeModel.getRecipeDetails(recipeId);
    return res.render('./recipes/recipeDetailsView', { recipe, logged: req.user || 'empty' });
  }

  return res.render(`./recipes/${req.params.id}/edit`, { recipe, message: null || 'Preencha todos os campos' });
};

const deleteRecipeForm = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const recipe = await recipeModel.getRecipeDetails(id);
  if (recipe.authorId === userId) {
    return res.render('./recipes/deleteRecipe', { recipe, message: null });
  }
  return res.redirect('/');
};

const deleteRecipe = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const { password } = req.body;
  const userDetails = await userModel.findById(userId);
  if (password === userDetails.password) {
    await recipeModel.deleteRecipe(id, userId);
    const recipes = await recipeModel.getRecipesFromDataBase();
    return res.render('./recipes/recipeView',
      { recipes, message: 'Receita excluída com sucesso', logged: req.user || 'empty' });
  }
  return res.render('./recipes/deleteRecipe', { recipe: { id }, message: 'Senha inválida' });
};

const searchRecipes = async (req, res) => res.render('./recipes/searchRecipe');

const searchForm = async (req, res) => {
  const { q } = req.body;
  if (q.length > 0) {
    const recipes = await recipeModel.searchRecipe(q);
    return res.render('./recipes/recipeView', { recipes, message: 'Pesquisa Realizada', logged: req.user || 'empty' });
  }
  return res.redirect('/recipes/search');
};

module.exports = {
  findRecipes,
  findRecipeDetail,
  verifyNewRecipeForm,
  editRecipeController,
  loginRecipeEdit,
  deleteRecipe,
  deleteRecipeForm,
  searchRecipes,
  searchForm,
};
