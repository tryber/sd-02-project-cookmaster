const express = require('express');
const middlewares = require('../middlewares');
const controllers = require('../controllers');

const router = express.Router();

router.get(/\/[0-9]+$/, middlewares.auth(false), (req, res) => controllers.recipesController.recipeDetails(req, res));

router.use(middlewares.auth());

router.get('/:id/edit', (req, res) => controllers.recipesController.modifyRecipePage(req, res));

router.get('/:id/delete', (req, res) => controllers.recipesController.deleteRecipePage(req, res));

router.post('/:id/delete', (req, res) => controllers.recipesController.deleteRecipe(req, res));

router.get('/search', (req, res) => controllers.recipesController.recipeSearchPage(req, res));

router.post('/:id', (req, res) => controllers.recipesController.modifyRecipe(req, res));

router.get('/new', (_req, res) => controllers.recipesController.newRecipesPage(_req, res));

router.get('/', (_req, res) => res.redirect('/recipes/new'));

router.post('/', (req, res) => controllers.recipesController.createNewRecipe(req, res));

module.exports = router;
