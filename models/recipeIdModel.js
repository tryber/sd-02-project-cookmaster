const { byId } = require('./searchByID.js');
const { insertDb } = require('./insertDB');

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
  try {
    const fields = ['recipe_name', 'ingredients', 'how_to_prepare', 'creator_id'];
    const params = [recipeName, ingredients, howToPrepare, id];
    await insertDb('Recipes', fields, params);
  } catch (error) {
    console.log(error);
  }
};

const editRecipe = async () => {
  console.log('aqui');
};

module.exports = {
  findRecipe,
  createRecipe,
  editRecipe,
};
