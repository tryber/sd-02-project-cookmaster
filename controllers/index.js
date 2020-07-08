const userController = require('./userController');
const recipeController = require('./recipeController');
const recipeDetails = require('./recipeDetails');
const getNewUser = require('./getNewUser');
const postNewUser = require('./postNewUser');
const getNewRecipe = require('./getNewRecipe');
const postNewRecipe = require('./postNewRecipe');
const recipeEdit = require('./recipeEdit');
const postNewEdit = require('./postNewEdit');
const recipeDelete = require('./recipeDelete');
const postNewDelete = require('./postNewDelete');
const getSearch = require('./getSearch');

module.exports = {
  userController,
  recipeController,
  recipeDetails,
  getNewUser,
  postNewUser,
  getNewRecipe,
  postNewRecipe,
  recipeEdit,
  postNewEdit,
  recipeDelete,
  postNewDelete,
  getSearch,
};
