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


app.get('/', controllers.receitasController.getAllReceitas);

app.get('/login', controllers.userController.loginForm);
app.post('/login', controllers.userController.login);


app.get('/admin', middlewares.auth(), (req, res) =>
  res.render('admin/home', { user: req.user }),
);

app.get('/logout', middlewares.auth(), controllers.userController.logout);

app.get('/cadastro', controllers.userController.pageCadastro);
app.post('/cadastro', controllers.userController.cadastro);

app.get('/recipes/new', middlewares.auth(), controllers.receitasController.pageNewReceita);
app.post('/recipes', middlewares.auth(), controllers.receitasController.addReceita);

app.get('/recipes/:id/edit', middlewares.auth(), controllers.receitasController.pageEditReceita);
app.post('/recipes/:id', middlewares.auth(), controllers.receitasController.updateReceita);

app.get('/recipes/:id/delete', middlewares.auth(), controllers.receitasController.pageDelReceita);
app.post('/recipes/:id/delete', middlewares.auth(), controllers.receitasController.deleteReceita);

app.get('/me/recipes', middlewares.auth(), controllers.receitasController.minhasReceitas);

app.get('/me/edit', middlewares.auth(), controllers.userController.editUserpage);
app.post('/me', middlewares.auth(), controllers.userController.editUser);

app.get('/recipes/search', middlewares.auth(), controllers.receitasController.search);

app.get('/recipes/:id', middlewares.auth(false), controllers.receitasController.getReceitaById);

app.listen(3000, () => console.log('Listening on 3000'));
