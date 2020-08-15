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

app.get('/', middlewares.auth(), controllers.recipesController.recipesLandingPage);

app.get('/recipes/:id', middlewares.auth(false), (req, res) => controllers.recipesController.recipeDetails(req, res));

app.get('/admin', middlewares.auth(), (req, res) => res.render('admin/home', { user: req.user }));

app.get('/login', controllers.userController.loginForm);
app.get('/logout', controllers.userController.logout);
app.get('/register', controllers.registrationController.displayRegistration);

app.post('/register', controllers.registrationController.registerUser);

app.post('/login', controllers.userController.login);

app.listen(3000, () => console.log('Listening on 3000'));
