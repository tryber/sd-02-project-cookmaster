const requestSession = require('./requestSession');

const updateRecipe = async ({ name, ingredients, prepare, id }) =>
  requestSession()
    .then((session) =>
      session.sql('UPDATE cookie_master.Recipes SET recipe_name=?,ingredients=?, how_to_prepare=? WHERE id=?')
        .bind(name)
        .bind(ingredients)
        .bind(prepare)
        .bind(id)
        .execute(),
    )
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });

module.exports = updateRecipe;
