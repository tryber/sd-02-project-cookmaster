const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const middlewares = require('./middlewares');
const controllers = require('./controllers');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', middlewares.auth(false), controllers.rootController.getALLRecipes);

app.get('/recipes/new', middlewares.auth(), controllers.recipesIdController.newRecipePage);
app.post('/recipes/new', middlewares.auth(), controllers.recipesIdController.createRecipe);

app.get('/recipes/:id/edit', middlewares.auth(), controllers.recipesIdController.editRecipe);
app.post('/recipes/:id/edit', middlewares.auth(), controllers.recipesIdController.updateRecipe);

app.get('/recipes/:id', middlewares.auth(false), controllers.recipesIdController.getRecipeInfo);

app.get('/new-user/', controllers.userController.createNewUserPage);
app.post('/new-user/', controllers.userController.createNewUser);

app.get('/admin', middlewares.auth(), (req, res) => {
  return res.render('admin/home', { user: req.user });
});

app.get('/login', controllers.userController.loginForm);
app.get('/logout', controllers.userController.logout);
app.post('/login', controllers.userController.login);

app.listen(3000, () => console.log('Listening on 3000'));
