const express = require('express');

const recipeController = require('./controllers/recipeController');

const app = express();

// app.get('/', recipeController.listRecipes);

// const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const middlewares = require('./middlewares');
const controllers = require('./controllers');

// const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', './views');

// app.get('/', (_req, res) => {
//   return res.render('home');
// });

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
app.get('/recipes/:id', middlewares.auth(false), recipeController.showRecipeDetails);

// app.get('/register', (req, res) => {
//   return res.render('admin/register');
// });

app.listen(3000, () => console.log('Listening on 3000'));
