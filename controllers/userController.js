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

const showAdmin = (req, res) => res.render('admin/home', { user: req.user });

const newUser = (_req, res) => {
  res.render('users/signup', { message: null });
};

const insertUser = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!userModel.isValid(email, password, firstName, lastName)) {
    return res.render('users/signup', { message: 'Dados inválidos' });
  }

  await userModel.insertUser(email, password, firstName, lastName);
  res.redirect('login');
};

module.exports = {
  login,
  loginForm,
  logout,
  showAdmin,
  newUser,
  insertUser,
};
