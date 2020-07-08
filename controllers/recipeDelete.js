const oneRecipe = require('../models/oneRecipe');

const recipeDelete = async (req, res) => {
  const recipe = await oneRecipe(req.params.id);
  if (req.user.id !== recipe[4]) return res.redirect(`/recipes/${recipe[0]}`);
  return res.render('admin/formDelete', { id: recipe[0] });
};

module.exports = recipeDelete;
