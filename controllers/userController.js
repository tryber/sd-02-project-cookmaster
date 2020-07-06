const { v4: uuid } = require('uuid');
const { SESSIONS } = require('../middlewares/auth');

const userModel = require('../models/userModel');
const { getRecipeDetails } = require('../models/userModel');

const loginForm = (req, res) => {
  const { token = '' } = req.cookies || {};

  if (SESSIONS[token]) return res.redirect('/');

  return res.render('admin/login', {
    message: null,
    redirect: req.query.redirect,
  });
};

const login = async (req, res, _next) => {
  const { email, password, redirect } = req.body;

  if (!email || !password) {
    return res.render('admin/login', {
      message: 'Preencha o email e a senha',
      redirect: null,
    });
  }

  const user = await userModel.findByEmail(email);
  if (!user || user.password !== password) {
    return res.render('admin/login', {
      message: 'Email ou senha incorretos',
      redirect: null,
    });
  }

  const token = uuid();
  SESSIONS[token] = user.id;

  res.cookie('token', token, { httpOnly: true, sameSite: true });
  res.redirect(redirect || '/admin');
};

const logout = (req, res) => {
  res.clearCookie('token');
  if (!req.cookies || !req.cookies.token) return res.redirect('/login');
  res.render('admin/logout');
};

const getAllRecipes = async (req, res) => {
  const { user } = req;
  const recipes = await userModel.getAll();
  res.render('home', { recipes, user });
};

const findRecipeById = async (req, res) => {
  const recipe = await userModel.getRecipeDetails(req.params.id);
  let recipeUser = false;
  if (req.user) recipeUser = (req.user.id === recipe[0][4]);
  res.render('recipes/details', { recipe, recipeUser });
  // const details = await userModel.getRecipeDetails()
};

const createUser = async (req, res) => {
  const { email, password, name, lastName } = req.body;
  if (!email || !password || !name || !lastName) {
    return res.render('user/register', {
      message: 'Todos os campos são obrigatórios',
      error: true,
    });
  }
  await userModel.createNewUser(name, lastName, email, password);
  return res.render('user/register', {
    message: 'Usuario criado com sucesso',
    error: true,
  });
};

const registerForm = async (req, res) => {
  res.render('user/register', {
    message: '',
    error: false,
  });
};

const createRecipe = async (req, res) => {
  const { recipeName, ingredients, recipe, author } = req.body;
  if (!recipeName || !ingredients || !recipe || !author) {
    return res.render('recipes/new', {
      message: 'Todos os campos são obrigatórios',
      error: true,
    });
  }
  await userModel.createNewRecipe(recipeName, ingredients, recipe, req.user.id);
  return res.render('recipes/new', {
    message: 'Cadastro Feito Com sucesso',
    error: true,
  });
};

const registerRecipeForm = async (req, res) => {
  res.render('recipes/new', {
    message: '',
    error: false,
  });
};

const updateRecipeForm = async (req, res) => {
  const { id: userId } = req.user;
  const { id } = req.params;
  const recipe = await getRecipeDetails(id);

  if (userId !== recipe[0][4]) {
    return res.redirect(`/recipes/${recipe[0][0]}`);
  }

  if (recipe.length !== 0) {
    return res.render('recipes/edit', { recipe });
  }
  return res.redirect('/');
};

const updateRecipe = async (req, res) => {
  const { id: userId } = req.user || [];
  const { recipeName, ingredients, recipe } = req.body;
  const recipeInfos = await getRecipeDetails(req.params.id);

  if (userId !== recipeInfos[0][4]) {
    return res.redirect(`/recipes/${recipeInfos[0][0]}`);
  }

  console.log(recipeName, ingredients, recipe, req.params.id);

  await userModel.updateRecipe(recipeName, ingredients, recipe, req.params.id);

  return res.redirect(`/recipes/${recipeInfos[0][0]}`);
};

module.exports = {
  login,
  loginForm,
  logout,
  getAllRecipes,
  findRecipeById,
  createUser,
  registerForm,
  createRecipe,
  registerRecipeForm,
  updateRecipeForm,
  updateRecipe,
};
