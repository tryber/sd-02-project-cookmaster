const oneRecipe = require('../models/oneRecipe');

const recipeDetails = async (req, res) => {
  const recipe = await oneRecipe(req.params.id);
  const { id } = req.user || false;
  res.render('details', { recipe, token: id });
};

module.exports = recipeDetails;
