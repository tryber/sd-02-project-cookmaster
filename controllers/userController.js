const { v4: uuid } = require('uuid');
const { SESSIONS } = require('../middlewares/auth');

const userModel = require('../models/userModel');

function loginForm(req, res) {
  const { token = '' } = req.cookies || {};

  if (SESSIONS[token]) return res.redirect('/');

  return res.render('admin/login', {
    message: null,
    redirect: req.query.redirect,
  });
}

async function login(req, res) {
  const { email, password, redirect } = req.body;

  if (!email || !password)
    return res.render('admin/login', {
      message: 'Preencha o email e a senha',
      redirect: null,
    });

  const user = await userModel.findUser({ key: 'email', value: email });

  if (!user)
    return res.render('admin/login', {
      message: 'Usuário não cadastrado',
      redirect: null,
    });

  if (user.password !== password)
    return res.render('admin/login', {
      message: 'Email ou senha incorretos',
      redirect: null,
    });

  const token = uuid();

  SESSIONS[token] = user.id;

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: true,
  });

  res.redirect(redirect || '/admin');
}

function logout(req, res) {
  res.clearCookie('token');
  if (!req.cookies || !req.cookies.token) return res.redirect('/login');
  res.render('admin/logout');
}

module.exports = {
  login,
  loginForm,
  logout,
};
