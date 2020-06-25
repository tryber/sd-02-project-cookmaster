const { validParams, postFunction } = require('../models/postUser');

const postRecipe = async ({ name, ingredients, prepare, id }) => {
  if (!validParams(name, ingredients, prepare)) return 'Não deve haver campos vazios';
  return postFunction(['recipe_name', 'ingredients', 'how_to_prepare', 'creator_id'],
    [name, ingredients, prepare, id],
  'Recipes');
};

module.exports = postRecipe;
