const express = require('express');
const middlewares = require('../middlewares');
const recipeModel = require('../models/recipeModel');

const router = express.Router();

router.get('/recipes', middlewares.auth(true), async (req, res) => {

  const { id } = req.user;

  const userRecipes = await recipeModel.getUserRecipes(id);

  res.render('user/recipes', { userRecipes });
});

module.exports = {
  router
};
