const { v4: uuid } = require('uuid');
const { SESSIONS } = require('../middlewares/auth');

const userModel = require('../models/userModel');

const loginForm = (req, res) => {
  const { token = '' } = req.cookies || {};

  if (SESSIONS[token]) return res.redirect('/');

  return res.render('admin/login', {
    message: null,
    redirect: req.query.redirect,
  });
};

const login = async (req, res, next) => {
  const { email, password, redirect } = req.body;

  if (!email || !password)
    return res.render('admin/login', {
      message: 'Preencha o email e a senha',
      redirect: null,
    });

  const user = await userModel.findByEmail(email);
  if (!user || user.password !== password)
    return res.render('admin/login', {
      message: 'Email ou senha incorretos',
      redirect: null,
    });

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
  const user = req.user;
  const recipes = await userModel.getAll();
  res.render('home', { recipes, user })
};

const findRecipeById = async (req, res) => {
  const recipe = await userModel.getRecipeDetails(req.params.id);
  let recipeUser = false;
  if (req.user) recipeUser = (req.user.id === recipe[0][4])
  res.render('recipes/details', { recipe, recipeUser })
  //const details = await userModel.getRecipeDetails()
}

module.exports = {
  login,
  loginForm,
  logout,
  getAllRecipes,
  findRecipeById,
};
