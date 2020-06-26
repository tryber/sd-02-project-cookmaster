const Root = require('../models/rootModel');

const GET_ALL_RECIPES_QUERY =
  `SELECT r.id, r.recipe_name, (CONCAT(first_name, ' ', u.last_name)) creator_name
FROM Recipes r
INNER JOIN Users u ON u.id = r.creator_id;`;

const getALLRecipes = async (req, res) => {
  let btn = false;
  if (req.user) {
    btn = true;
  }
  const allRecipes = await Root.queryDb(GET_ALL_RECIPES_QUERY);
  res.render('home', { results: allRecipes, btn });
};

module.exports = {
  getALLRecipes,
};
