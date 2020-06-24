const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const middlewares = require('./middlewares');
const controllers = require('./controllers');
const recipeController = require('./controllers/recipeController');
const userController = require('./controllers/userController');

const app = express();

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', middlewares.auth(false), recipeController.listRecipes);

app.get('/recipes/:id', middlewares.auth(false), recipeController.showRecipe);
app.get('/recipes/:id/edit', middlewares.auth(), (_req, _res) => console.log('edit'));

app.get('/admin', middlewares.auth(), (req, res) => res.render('admin/home', { user: req.user }));

app.get('/login', controllers.userController.loginForm);
app.get('/logout', controllers.userController.logout);
app.post('/login', controllers.userController.login);

app.get('/register', userController.registerForm);
app.post('/register', userController.newUser);

app.listen(3000, () => console.log('Listening on 3000'));
