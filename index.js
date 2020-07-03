const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rescue = require('express-rescue');

const middlewares = require('./middlewares');
const controllers = require('./controllers');

const app = express();

app.set('view engine', 'ejs');

app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(express.static(__dirname + '/public'));

app.get('/', middlewares.auth(false), rescue(controllers.recipesController.list));

app.get('/login', controllers.userController.loginForm);

app.post('/login', rescue(controllers.userController.login));

app.get('/logout', controllers.userController.logout);

app.get('/register', middlewares.auth(false), (_req, res) => {
  return res.render('pages/register', {
    error: { email: null, password: null, confirm: null, firstName: null, lastName: null },
  });
});

app.post('/register', middlewares.auth(false), rescue(controllers.registerController.register));

app.get('/recipes/search', middlewares.auth(false), controllers.recipesController.searchRecipe);

app.get('/recipes/new', middlewares.auth(), controllers.recipesController.recipeForm);

app.post('/recipes/new', middlewares.auth(), controllers.recipesController.newRecipe);

app.get('/recipes/:id/edit', middlewares.auth(), controllers.recipesController.editRecipe);

app.get('/recipes/:id/delete', middlewares.auth(), controllers.recipesController.deleteForm);

app.post('/recipes/:id/delete', middlewares.auth(), controllers.recipesController.deleteRecipe);

app.get('/recipes/:id', middlewares.auth(false), rescue(controllers.recipesController.details));

app.post('/recipes/:id', middlewares.auth(), controllers.recipesController.updateRecipe);

app.get('/me/recipes', middlewares.auth(), controllers.recipesController.myRecipes);

app.get('/me/edit', middlewares.auth(), controllers.registerController.userForm);

app.post('/me/edit', middlewares.auth(), controllers.registerController.updateUser);

app.listen(3000, () => console.log('Listening on 3000'));
