const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const middlewares = require('./middlewares');
const controllers = require('./controllers');
const recipesRouter = require('./routers/recipesRouter');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/recipes', recipesRouter);

app.get('/', middlewares.auth(false), controllers.recipesController.recipesLandingPage);

app.get('/admin', middlewares.auth(), (req, res) => res.render('admin/home', { user: req.user }));

app.get('/login', controllers.userController.loginForm);
app.get('/logout', controllers.userController.logout);
app.post('/login', controllers.userController.login);

app.get('/register', controllers.registrationController.displayRegistration);
app.post('/register', controllers.registrationController.registerUser);

app.get('/me/recipes', middlewares.auth(), controllers.recipesController.fetchMyRecipesPage);
app.get('/me/edit', middlewares.auth(), controllers.registrationController.editUserPage);
app.post('/me', middlewares.auth(), controllers.registrationController.editUser);

app.listen(3000, () => console.log('Listening on 3000'));
