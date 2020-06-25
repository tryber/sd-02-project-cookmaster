const { v4: uuid } = require('uuid');
const { SESSIONS } = require('../middlewares/auth');

const { findByEmail, validadeFormNewUser, createNewUserOnDB } = require('../models/userModel');
const { queryDb } = require('../models/rootModel');

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

  const user = await findByEmail(email);
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

const createNewUserPage = (req, res) => {
  res.render('new-user', { status: 'waiting', errors: false });
};

const createNewUser = async (req, res) => {
  const errArray = await validadeFormNewUser(req.body);
  if (!errArray.length) {
    await createNewUserOnDB(req.body);
    return res.render('new-user', { status: 'success', errors: false });
  }
  return res.render('new-user', { status: 'waiting', errors: errArray });
};

const userRecipes = async (req, res) => {

  const GET_ALL_RECIPES_FROM_USER_QUERY =
    `SELECT r.id, r.recipe_name, (CONCAT(first_name, ' ', u.last_name)) creator_name, r.creator_id
     FROM Recipes r
     INNER JOIN Users u ON u.id = r.creator_id
     HAVING creator_id = ${req.user.id};`;

  const results = await queryDb(GET_ALL_RECIPES_FROM_USER_QUERY);
  return res.render('userRecipes', { results });
};

module.exports = {
  login,
  loginForm,
  logout,
  createNewUserPage,
  createNewUser,
  userRecipes,
};
