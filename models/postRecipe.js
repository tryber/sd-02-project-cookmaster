const getSchema = require('./getSchema');
const { validParams } = require('../models/postUser');

const postRecipe = async ({ name, ingredients, prepare, id }) => {
  if (!validParams([name, ingredients, prepare, id])) return 'Não deve haver campos vazios';
  return getSchema()
    .then((db) =>
      db
        .getTable('Recipes')
        .insert(['recipe_name', 'ingredients', 'how_to_prepare', 'creator_id'])
        .values(name, ingredients, prepare, id)
        .execute(),
    )
    .then(() => true)
    .catch(() => 'Erro Inesperado! Não foi possível cadastrar receita.')
}

module.exports = postRecipe;
