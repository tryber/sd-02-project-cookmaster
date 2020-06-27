const recipesModels = require('../models/recipesModel');

async function list(req, res) {
  const { user } = req;

  const recipes = await recipesModels.getRecipes();

  if (!user) return res.render('home', { endpoint: 'login', name: null, recipes });

  return res.render('home', {
    endpoint: 'logout',
    name: `${user.firstName} ${user.lastName}`,
    recipes,
  });
}

module.exports = { list };
