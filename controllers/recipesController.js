const recipesModels = require('../models/recipesModel');

async function details(req, res) {
  const { user } = req;
  const { id } = req.params;

  const recipe = await recipesModels.findRecipe(id);

  if (recipe) return res.redirect('/');

  if (!user)
    return res.render('admin/details', {
      name: null,
      endpoint: 'login',
      isUser: false,
      recipe,
    });

  if (id === recipe.userId)
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

module.exports = { list, details };
