const getRecipes = require('../models/getRecipes');

const receiveRecipes = async (req, res) => {
  const response = await getRecipes();
  const recipes = await response.fetchAll();
  res.render('home', { recipes, token: req.headers.cookie });
};

module.exports = receiveRecipes;
