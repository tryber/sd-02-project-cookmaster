const useSession = require('./useSession');

const getAllRecipes = async () =>
  useSession()
    .then((session) => session
      .sql(`SELECT 
            r.id,
            r.recipe_name AS recipeName,
            CONCAT(u.first_name, ' ', u.last_name) AS userName
            FROM
            recipes r
            INNER JOIN
            users u
            WHERE
            u.id = r.user_id;`)
      .execute())
    .then((results) => results.fetchAll())
    .then((recipes) =>
      recipes.map(([recipeId, recipeName, userName]) => ({ recipeId, recipeName, userName })));

const getSingleRecipe = async (idRecipe) => 
  useSession()
    .then((session) => session
      .sql(`SELECT 
            r.id, 
            r.recipe_name, 
            r.ingredients, 
            r.instructions, 
            (SELECT CONCAT(u.first_name, ' ', u.last_name) FROM users u WHERE r.user_id = u.id)
            FROM recipes r
            WHERE r.id = ${idRecipe};`)
      .execute())
    .then((results) => results.fetchAll())
    .then((recipes) => {
      const [recipeId, recipeName, ingredients, instructions, userName] = recipes[0];
      return { recipeId, recipeName, ingredients, instructions, userName };
    });

module.exports = { getAllRecipes, getSingleRecipe };
