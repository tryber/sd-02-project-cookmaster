const { connection } = require('./connection');

const findRecipe = async (id) => {
  try {
    const db = await connection();
    const results = await db.getTable('Recipes')
      .select(['recipe_name', 'ingredients', 'how_to_prepare', 'id', 'creator_id'])
      .where('id = :id')
      .bind('id', id)
      .execute();
    const recipes = await results.fetchAll();
    const objRecipe = recipes.map(([recipeName, ingredients, howToPrepare, id, creatorId]) => ({
      recipeName,
      ingredients,
      howToPrepare,
      id,
      creatorId,
    }));
    return objRecipe;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  findRecipe,
};