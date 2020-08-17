const express = require('express');
const middlewares = require('../middlewares');
const controllers = require('../controllers');

const router = express.Router();

router.get(/\/[0-9]+$/, middlewares.auth(false), (req, res) => controllers.recipesController.recipeDetails(req, res));

router.use(middlewares.auth());

router.get('/:id/edit', (req, res) => controllers.recipesController.modifyRecipe(req, res));

router.get('/new', (_req, res) => controllers.recipesController.newRecipesPage(_req, res));

router.get('/', (_req, res) => res.redirect('/recipes/new'));

router.post('/', (req, res) => controllers.recipesController.createNewRecipe(req, res));

module.exports = router;
