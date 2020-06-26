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

app.get('/admin', middlewares.auth(), (req, res) => {
  return res.render('admin/home', { user: req.user });
});

app.get('/login', controllers.userController.loginForm);
app.get('/logout', controllers.userController.logout);
app.post('/login', controllers.userController.login);

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

app.get('/recipes/:id', middlewares.auth(false), controllers.recipeController.findRecipeDetail);

app.get('/', middlewares.auth(false), controllers.recipeController.findRecipes);

app.listen(3000, () => console.log('Listening on 3000'));
