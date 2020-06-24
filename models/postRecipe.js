const { validParams, postFunction } = require('../models/postUser');

const postRecipe = async ({ name, ingredients, prepare, id }) => {
  if (!validParams([name, ingredients, prepare, id])) return 'Não deve haver campos vazios';
  return postFunction(['recipe_name', 'ingredients', 'how_to_prepare', 'creator_id'],
    [name, ingredients, prepare, id])
    .then(() => true)
    .catch(() => 'Erro Inesperado! Não foi possível cadastrar receita.');
};

module.exports = postRecipe;
