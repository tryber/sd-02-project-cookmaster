const { SESSIONS } = require('../middlewares/auth');
const recipeModel = require('../models/recipeModel');
const express = require('express');

const router = express.Router();

router.get('/:id', async ({ params: { id } }, res) => {
  const recipe = await recipeModel.getRecipe(id);
  res.render('recipes/details', { recipe });
});

module.exports = {
  router,
};

