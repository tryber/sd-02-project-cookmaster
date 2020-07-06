const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { getSession } = require('./models/connection');
const middlewares = require('./middlewares');
const controllers = require('./controllers');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', './views');

// get é rota
// render é caminho interno

app.get('/admin', middlewares.auth(), (req, res) => {
  return res.render('./admin/home', { user: req.user });
});

app.get('/login', controllers.userController.loginForm);
app.get('/logout', controllers.userController.logout);
app.post('/login', controllers.userController.login);

app.get('/users/new', (req, res) => {
  res.status(200).render('./admin/newUser', { message: null, login: false });
});
app.post('/users/new', controllers.userController.verifyNewForm);

app.get('/users', async (req, res) => {
  getSession()
  .then((session) => {
    session.close();
    res.status(200).json({ message: 'Entrou!' });
  })
  .catch((err) => {
    res.status(500).json({ error: err.message, stack: err.stack });
  });
});

app.get('/recipes/:id/edit', middlewares.auth(), controllers.recipeController.loginRecipeEdit);
app.post('/recipes/:id/edit', middlewares.auth(), controllers.recipeController.editRecipeController);

app.get('/recipes/:id/delete', middlewares.auth(), controllers.recipeController.deleteRecipeForm);
app.post('/recipes/:id/delete', middlewares.auth(), controllers.recipeController.deleteRecipe);

app.get('/recipes/new', middlewares.auth(), (req, res) => {
  res.status(200).render('./recipes/newRecipe', { message: null, authorId: req.user.id });
});
app.post('/recipes/new', middlewares.auth(), controllers.recipeController.verifyNewRecipeForm);

app.get('/recipes/:id', middlewares.auth(false), controllers.recipeController.findRecipeDetail);

app.get('/', middlewares.auth(false), controllers.recipeController.findRecipes);

app.listen(3000, () => console.log('Listening on 3000'));
