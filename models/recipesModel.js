const connection = require('./connection');

const readRecipes = async () => {
  const recipesData = await connection().then((db) =>
  db
    .getTable('recipes')
    .select(['id', 'name'])
    .execute()
  )
    .then((results) => results.fetchAll())
    .then((data) => fetchRecipeWithAuthor(data));
  return recipesData;
}

const fetchRecipeWithAuthor = async (recipesData) => {
  // console.log(recipesData)
  const recipes = recipesData.map(([ id, name ]) => 
  connection().then((db) =>
  db
    .getTable('users_recipes')
    .select('user_id')
    .where('recipe_id = :id')
    .bind('id', id)
    .execute())
    .then((results) => results.fetchAll())
    .then(([[ userID ]]) => 
      connection().then((db) =>
      db
        .getTable('users')
        .select(['id', 'name', 'last_name'])
        .where('id = :userID')
        .bind('userID', userID)
        .execute()))
      .then((results) => results.fetchAll())
      .then(([ authorInfo ]) => ({ id, name, authorInfo: {
    'id': authorInfo[0], fullName: `${authorInfo[1]} ${authorInfo[2]}`
  }})))
  
  return Promise.all(recipes).then((results) => results);
};


module.exports = {
  readRecipes
};
