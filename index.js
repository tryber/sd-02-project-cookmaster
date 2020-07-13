const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const middlewares = require('./middlewares');
const controllers = require('./controllers');

const { schema } = require('./models/connections');

schema().then(() => {
  console.log('Conectado ao MySQL!');
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', middlewares.auth(false), controllers.userController.getAllRecipes);

app.get('/recipes/new', middlewares.auth(), controllers.userController.registerRecipeForm);
app.post('/recipes/new', middlewares.auth(), controllers.userController.createRecipe);

app.get('/recipes/:id/edit', middlewares.auth(), controllers.userController.updateRecipeForm);
app.post('/recipes/:id/edit', middlewares.auth(), controllers.userController.updateRecipe);

app.get('/recipes/search', middlewares.auth(false), controllers.userController.searchRecipeForm);

app.get('/recipes/:id', middlewares.auth(false), controllers.userController.findRecipeById);

app.get('/user/register', middlewares.auth(false), controllers.userController.registerForm);
app.post('/user/register', middlewares.auth(false), controllers.userController.createUser);

app.get('/recipes/:id/delete', middlewares.auth(), controllers.userController.deleteRecipeForm);
app.post('/recipes/:id/delete', middlewares.auth(), controllers.userController.deleteRecipe);

app.get('/admin', middlewares.auth(), (req, res) => res.render('admin/home', { user: req.user }));

app.get('/login', controllers.userController.loginForm);
app.get('/logout', controllers.userController.logout);
app.post('/login', controllers.userController.login);

app.listen(3000, () => console.log('Listening on 3000'));
