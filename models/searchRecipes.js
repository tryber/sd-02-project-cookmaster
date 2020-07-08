const requestSession = require('./requestSession');

const searchRecipes = async (name) =>
  requestSession()
    .then((session) =>
      session.sql('SELECT r.recipe_name, u.first_name, r.id FROM cookie_master.Users AS u INNER JOIN cookie_master.Recipes AS r ON r.creator_id = u.id WHERE r.recipe_name REGEXP ?;').bind(name).execute())
    .then((results) => results.fetchAll());


module.exports = searchRecipes;
