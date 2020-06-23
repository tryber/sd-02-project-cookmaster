const connection = require("./connection");

const findAllRecipes = async () => {
  try {
    const db = await connection()
    const results = await db.getTable('Recipes').select(['recipe_name', 'creator_id']).execute();
    const recipes = await results.fetchAll();
    return recipes;
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  findAllRecipes,
};