const connection = require('./connections');

/**
 * Captura os títulos de todas as receitas no banco
 */

const queryUser = `SELECT
re.recipe_id, re.recipe_name, CONCAT(us.first_name, ' ', us.last_name)
FROM recipes AS re
INNER JOIN users AS us ON us.id = re.insert_user;`

const getNames = async () =>
  connection().then((session) =>
    session.sql(queryUser)
      .execute()
      .then((results) => results.fetchAll())
      .then((recipes) =>
        recipes.map(
          ([id, recipe, userName]) =>
            ({ id, recipe, userName }),
        )
      )
  );

/**
 * Retorna a receita completa de acordo com o ID
 * @param {number} id ID da receita a ser retornada
 */

const queryRecipe = `SELECT
fs.recipe_name, fs.ingredients, fs.process_recipe, CONCAT(us.first_name, ' ', us.last_name)
FROM (SELECT recipe_name, ingredients, process_recipe, insert_user
FROM recipes
WHERE recipe_id = ?) AS fs
inner join users AS us ON fs.insert_user = us.id;`

const getRecipe = async (id) =>
  connection().then((session) =>
    session.sql(queryRecipe)
      .bind(id)
      .execute())
    .then((results) => results.fetchAll()[0])
    .then(([recipe_name, ingredients, process_recipe, insert_user]) =>
      ({ recipe_name, ingredients, process_recipe, insert_user }));

module.exports = {
  getNames,
  getRecipe,
}
