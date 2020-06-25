const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const middlewares = require('./middlewares');
const controllers = require('./controllers');

const app = express();

const adminRouter = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', './views');


app.get('/', controllers.receitasController.getAllReceitas);

app.get('/login', controllers.userController.loginForm);
app.post('/login', controllers.userController.login);

adminRouter.use(middlewares.auth());

adminRouter.get('/admin', (req, res) =>
  res.render('admin/home', { user: req.user })
);

adminRouter.get('/logout', controllers.userController.logout);

adminRouter.get('/cadastro', controllers.userController.pageCadastro);
adminRouter.post('/cadastro', controllers.userController.cadastro);

adminRouter.get('/recipes/new', controllers.receitasController.pageNewReceita);
adminRouter.post('/recipes', controllers.receitasController.addReceita);

adminRouter.get('/recipes/search', controllers.receitasController.search);

adminRouter.get('/recipes/:id', controllers.receitasController.getReceitaById);

adminRouter.get('/recipes/:id/edit', controllers.receitasController.pageEditReceita);
adminRouter.post('/recipes/:id', controllers.receitasController.updateReceita);

adminRouter.get('/recipes/:id/delete', controllers.receitasController.pageDelReceita);
adminRouter.post('/recipes/:id/delete', controllers.receitasController.deleteReceita);

adminRouter.get('/me/recipes', controllers.receitasController.minhasReceitas);

app.use('/', adminRouter);

app.listen(3000, () => console.log('Listening on 3000'));
