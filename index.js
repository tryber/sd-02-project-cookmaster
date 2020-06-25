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

app.get('/', middlewares.auth(false), controllers.recipeController.listRecipeNameAuthors);

app.get('/recipes/new', middlewares.auth(), controllers.recipeController.newRecipe);
app.post('/recipes', middlewares.auth(), controllers.recipeController.insertRecipe);

app.get('/recipes/:id/edit', middlewares.auth(true), controllers.recipeController.showEditRecipe);
app.get('/recipes/:id/delete', middlewares.auth(true), controllers.recipeController.showDeleteRecipe);
// app.post('/recipes/:id/delete', middlewares.auth(true), controllers.recipeController.deleteRec);
app.get('/recipes/:id', middlewares.auth(false), controllers.recipeController.showRecipe);
app.post('/recipes/:id', middlewares.auth(true), controllers.recipeController.editRecipe);

app.get('/signup', middlewares.auth(false), controllers.userController.newUser);
app.post('/signup', middlewares.auth(false), controllers.userController.insertUser);

app.get('/admin', middlewares.auth(), (req, res) => res.render('admin/home', { user: req.user }));

app.get('/login', controllers.userController.loginForm);
app.get('/logout', controllers.userController.logout);
app.post('/login', controllers.userController.login);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
