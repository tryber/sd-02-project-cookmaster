const { byId } = require('./searchByID.js');
const { connection } = require('./connection');

const findRecipe = async (id) => {
  try {
    const arraySelection = ['recipe_name', 'ingredients', 'how_to_prepare', 'id', 'creator_id'];
    const recipes = await byId(id, 'Recipes', arraySelection);
    const objRecipe = recipes.map(([recipeName, ingredients, howToPrepare, idMap, creatorId]) => ({
      recipeName,
      ingredients,
      howToPrepare,
      id: idMap,
      creatorId,
    }));
    return objRecipe;
  } catch (e) {
    console.log(e);
  }
};

const createRecipe = async (id, recipeName, ingredients, howToPrepare) => {
  const db = await connection();
  await db.getTable('Recipes')
    .insert(['recipe_name', 'ingredients', 'how_to_prepare', 'creator_id'])
    .values(recipeName, ingredients, howToPrepare, id).execute();
}

module.exports = {
  findRecipe,
  createRecipe
};
