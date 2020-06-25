const { v4: uuid } = require('uuid');
const { SESSIONS } = require('../middlewares/auth');

const userModel = require('../models/userModel');
const insertTable = require('../models/insertTable');

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

  const user = await userModel.findUser(email);
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

const registerForm = (req, res) => {
  const { token = '' } = req.cookies || {};

  if (SESSIONS[token]) return res.redirect('/');

  return res.render('admin/signup', {
    message: null,
  });
};

const newUser = async (req, res, _next) => {
  const {
    email, password, confirm_password: confirmPassword, first_name: firstName, last_name: lastName,
  } = req.body;

  if (!email || !password || !confirmPassword || !firstName || !lastName) {
    return res.render('admin/signup', { message: 'Preencha todos os campos' });
  }

  if (password !== confirmPassword) {
    return res.render('admin/signup', {
      message: 'Preencha a mesma senha nos dois campos',
    });
  }

  const registeredUser = await userModel.findUser(email);
  if (registeredUser) {
    return res.render('admin/signup', {
      message: 'Usuário já cadastrado, faça o login',
    });
  }

  await insertTable(
    'users',
    ['email', 'user_password', 'first_name', 'last_name'],
    { email, password, firstName, lastName },
  );

  return login(req, res);
};

module.exports = {
  login,
  loginForm,
  logout,
  newUser,
  registerForm,
};
