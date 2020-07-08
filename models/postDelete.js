const requestSession = require('./requestSession');

const updateRecipe = async (id) =>
  requestSession()
    .then((session) =>
      session.sql('DELETE FROM cookie_master.Recipes WHERE id=?')
        .bind(id)
        .execute(),
    )
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });

module.exports = updateRecipe;
