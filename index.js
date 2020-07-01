const express = require('express');

const recipeController = require('./controllers/recipeController');

const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const middlewares = require('./middlewares');
const controllers = require('./controllers');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/admin', middlewares.auth(), (req, res) => {
  return res.render('admin/home', { user: req.user });
});

app.get('/login', controllers.userController.loginForm);
app.get('/logout', controllers.userController.logout);
app.post('/login', controllers.userController.login);

app.get('/register', controllers.userController.registerForm);
app.post('/register', controllers.userController.register);

app.get('/', middlewares.auth(false), recipeController.listRecipes);

app.get('/recipes/new', middlewares.auth(), recipeController.newRecipeForm);
app.post('/recipes', middlewares.auth(), recipeController.newRecipe);
app.get('/recipes/search', recipeController.searchRecipes);
// app.get('/recipes/search?q=:q', recipeController.searchRecipes);
app.get('/recipes/:id/edit', middlewares.auth(), recipeController.editRecipeForm);
app.get('/recipes/:id/delete', middlewares.auth(), recipeController.deleteRecipeForm);
app.post('/recipes/:id/delete', middlewares.auth(), recipeController.deleteRecipe);
app.get('/recipes/:id', middlewares.auth(false), recipeController.showRecipeDetails);
app.post('/recipes/:id', middlewares.auth(), recipeController.editRecipe);

app.listen(3000, () => console.log('Listening on 3000'));
