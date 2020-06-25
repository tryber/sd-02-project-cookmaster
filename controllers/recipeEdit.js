const oneRecipe = require('../models/oneRecipe');

const recipeEdit = async (req, res) => {
  const recipe = await oneRecipe(req.params.id);
  const [id, name, ingredients, how, createId] = recipe;
  if (req.user.id !== createId) return res.redirect(`/recipes/${id}`);
  return res.render('admin/formEdit', { id, name, ingredients, how });
};
module.exports = recipeEdit;
