const requestSession = require('./requestSession');

const getRecipes = async () =>
  requestSession()
    .then((session) =>
      session.sql('SELECT r.recipe_name, u.first_name, r.id FROM cookie_master.Users AS u INNER JOIN cookie_master.Recipes AS r ON r.creator_id = u.id;').execute())
    .then((results) => results);


module.exports = getRecipes;
