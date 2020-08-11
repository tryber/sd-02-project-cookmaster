const recipeModel = require('../models/recipeModel');
const express = require('express');
const middlewares = require('../middlewares');

const router = express.Router();

router.get('/new', middlewares.auth(true), async (_req, res) => {
  res.render('recipes/newRecipe', { error: '', message: '' });
});

router.post('/', middlewares.auth(true), async (req, res) => {
  const { error, message, id } = await recipeModel.createRecipe(req.body, req.user.id);
  res.redirect(`recipes/${id}`);
});

router.get('/:id', middlewares.auth(false), async (req, res) => {
  const recipe = await recipeModel.getRecipe(req.params.id);
  const user = req.user || {};
  res.render('recipes/details', { recipe, user });
});

router.get('/:id/edit', middlewares.auth(true), async (req, res) => {
  const { title, ingredients, detailsRecipe, idUser } = await recipeModel.getRecipe(req.params.id);

  if (req.user.id !== idUser) return res.redirect('/');

  res.render('recipes/editRecipe', {
    title,
    ingredients,
    detailsRecipe,
    id: idUser,
  });
});

router.post('/:id', middlewares.auth(true), async ({ body, params: { id }, user }, res) => {
  const recipe = {
    title: body.title,
    ingredients: body.ingredients,
    detailsRecipe: body.detailsRecipe,
    idUser: id,
  };

  try {
    await recipeModel.updateRecipe(recipe);
    res.render('recipes/details', { user, recipe });
  } catch(err) { 
    err.code
  }
});

module.exports = {
  router,
};

