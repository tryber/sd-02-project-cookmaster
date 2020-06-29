const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const rescue = require('express-rescue');

const middlewares = require('./middlewares');
const controllers = require('./controllers');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', middlewares.auth(false), controllers.recipesController.list);

app.get('/login', controllers.userController.loginForm);

app.post('/login', controllers.userController.login);

app.get('/logout', controllers.userController.logout);

app.get('/register', middlewares.auth(false), (_req, res) => {
  return res.render('admin/register', {
    error: { email: null, password: null, confirm: null, firstName: null, lastName: null },
  });
});

app.post('/register', middlewares.auth(false), rescue(controllers.registerController.register));

app.get('/recipes/new', middlewares.auth(), (_req, res) => {
  return res.render('admin/newRecipe', {
    recipe: { name: null, ingredients: null, instructions: null, id: null },
  });
});

app.post('/recipes/new', middlewares.auth(), controllers.recipesController.newRecipe);

app.get('/recipes/search', middlewares.auth(false), controllers.recipesController.searchRecipe);

app.get('/recipes/:id', middlewares.auth(false), controllers.recipesController.details);

app.post('/recipes/:id', middlewares.auth(), controllers.recipesController.updateRecipe);

app.get('/recipes/:id/edit', middlewares.auth(), controllers.recipesController.editRecipe);

app.get('/recipes/:id/delete', middlewares.auth(), (req, res) => {
  return res.render('admin/delete', { message: null, id: req.params.id });
});

app.post('/recipes/:id/delete', middlewares.auth(), controllers.recipesController.deleteRecipe);

app.listen(3000, () => console.log('Listening on 3000'));
