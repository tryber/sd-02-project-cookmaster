const recipeModel = require('../models/recipeModel');

const findRecipes = async (req, res) => {
  const recipes = await recipeModel.getRecipesFromDataBase();
  if (!recipes) return res.render('./404/notFound');
  res.render('./recipes/recipeView', { recipes, logged: req.user });
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
    return res.render('./recipes/newRecipe', { message: 'Receita criada com sucesso' });
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
  if ( id, name, ingredients, prepareMethod ) {
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
    const recipe = await recipeModel.getRecipeDetails(recipeId);
    return res.render(`./recipes/recipeDetailsView`, { recipe, logged: req.user || 'empty' });
  }

  return res.render(`./recipes/${req.params}/edit`, { recipe, message: null || 'Preencha todos os campos' });
};

module.exports = {
  findRecipes,
  findRecipeDetail,
  verifyNewRecipeForm,
  editRecipeController,
  loginRecipeEdit,
};
