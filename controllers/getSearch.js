const searchRecipes = require('../models/searchRecipes');

const getSearch = async (req, res) => {
  const { q } = req.query;
  let recipes;
  if (q) recipes = await searchRecipes(req.query.q);
  return res.render('search', { recipes: false || recipes });
};

module.exports = getSearch;
