const RecipeId = require('../models/recipeIdModel');
const Root = require('../models/rootModel');

const getRecipeInfo = async (req, res) => {
  const recipeDetails = await RecipeId.findRecipe(req.params.id);
  const id = req.user ? req.user.id : false;
  res.render('recipeDetail', { recipeDetails, id });
};

const newRecipePage = (_req, res) => {
  res.render('newRecipe', { err: false, success: false });
};

const createRecipe = async (req, res) => {
  const { recipeName, ingredients, howToPrepare } = req.body;
  if (!recipeName || !ingredients || !howToPrepare) {
    return res.render('newRecipe', { err: true, success: false });
  }
  await RecipeId.createRecipe(req.user.id, recipeName, ingredients, howToPrepare);
  return res.render('newRecipe', { err: false, success: true });
};

const editRecipe = async (req, res) => {
  const recipeDetails = await RecipeId.findRecipe(req.params.id);
  console.log(1, req.user.id);
  console.log(2, recipeDetails);
  if (req.user.id !== recipeDetails[0].creatorId) {
    return res.redirect(`/recipes/${req.params.id}`)
  }
  res.render('editRecipe', { id: req.params.id, recipeDetails });
};

const updateRecipe = async (req, res) => {
  const { recipeName, ingredients, howToPrepare } = req.body;

  const UPDATE_QUERY =
    `UPDATE Recipes
	  SET recipe_name = '${recipeName}',
        ingredients = '${ingredients}',
        how_to_prepare = '${howToPrepare}'
    WHERE id = ${req.params.id};`;

  if (recipeName && ingredients && howToPrepare) {
    await Root.queryDb(UPDATE_QUERY);
    res.redirect(`/recipes/${req.params.id}`);
  }
};

module.exports = {
  getRecipeInfo,
  newRecipePage,
  createRecipe,
  editRecipe,
  updateRecipe,
};
