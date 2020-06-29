const recipesModels = require('../models/recipesModel');
const recipesModel = require('../models/recipesModel');

async function details(req, res) {
  const { user } = req;
  const { id } = req.params;

  const recipe = await recipesModels.findRecipe(id);

  if (!recipe) return res.redirect('/');

  if (!user)
    return res.render('admin/details', {
      name: null,
      endpoint: 'login',
      isUser: false,
      recipe,
    });

  if (user.id === recipe.userId)
    return res.render('admin/details', {
      name: null,
      endpoint: 'logout',
      isUser: true,
      recipe,
    });

  return res.render('admin/details', {
    name: user.fullName,
    endpoint: 'logout',
    isUser: false,
    recipe,
  });
}

async function list(req, res) {
  const { user } = req;

  const recipes = await recipesModels.getRecipes();

  if (!user)
    return res.render('home', {
      endpoint: 'login',
      name: null,
      recipes,
    });

  return res.render('home', {
    endpoint: 'logout',
    name: user.fullName,
    recipes,
  });
}

async function newRecipe(req, res) {
  try {
    const {
      user: { id, fullName },
      body,
    } = req;

    await recipesModel.createRecipe({ ...body, id, fullName });

    return res.redirect('/');
  } catch (err) {
    throw new Error(err);
  }
}

async function editRecipe(req, res) {
  try {
    const { id } = req.params;

    const recipe = await recipesModel.searchRecipe(id);

    return res.render('admin/newRecipe', { recipe });
  } catch (err) {
    throw new Error(err);
  }
}

async function deleteRecipe(req, res) {
  try {
    const {
      params: { id: recipeId },
      body: { password },
      user: { id: userId },
    } = req;

    const status = await recipesModel.deleteRecipe({ recipeId, userId, password });

    if (!status) return res.render('admin/delete', { message: 'senha incorreta' });

    return res.redirect('/');
  } catch (err) {
    throw new Error(err);
  }
}

async function updateRecipe(req, res) {
  try {
    const { id } = req.params;

    await recipesModel.updateRecipe({ id, ...req.body });

    return res.redirect('/');
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { list, details, newRecipe, editRecipe, deleteRecipe, updateRecipe };
