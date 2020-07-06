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
    const query = `INSERT INTO recipes (name, ingredients, prepare_method, author_id)
    VALUES
      ('${name}', '${ingredients}', '${prepareMethod}', '${id}');`;
    await recipeModel.createRecipe(query);
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
    const query = `UPDATE recipes
    SET
    name = '${name}',
    ingredients = '${ingredients}',
    prepare_method = '${prepareMethod}'
    WHERE
    id = '${recipeId}'
    AND
    author_id = '${id}';`;
    await recipeModel.editRecipe(query);
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
    const query = `DELETE FROM recipes
    WHERE id = '${id}'
    AND author_id = '${userId}';`;
    await recipeModel.deleteRecipe(query);
    const recipes = await recipeModel.getRecipesFromDataBase();
    return res.render('./recipes/recipeView',
      { recipes, message: 'Receita excluída com sucesso', logged: req.user || 'empty' });
  }
  return res.render('./recipes/deleteRecipe', { recipe: { id }, message: 'Email inválido' });
};

module.exports = {
  findRecipes,
  findRecipeDetail,
  verifyNewRecipeForm,
  editRecipeController,
  loginRecipeEdit,
  deleteRecipe,
  deleteRecipeForm,
};
