const Root = require('../models/rootModel');

const getALLRecipes = async (req, res) => {
  let btn = false;
  if (req.user) {
    btn = true;
  }
  const allRecipes = await Root.findAllRecipes();
  console.log(1, allRecipes)
  res.render('home', { results: allRecipes, btn });
};

module.exports = {
  getALLRecipes,
};
