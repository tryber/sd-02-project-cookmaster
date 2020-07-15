const { v4: uuid } = require('uuid');
const rescue = require('express-rescue');

const { SESSIONS } = require('../middlewares/auth');
const userModel = require('../models/userModel');


const loginForm = rescue((req, res) => {
  const { token = '' } = req.cookies || {};

  if (SESSIONS[token]) return res.redirect('/');

  return res.render('admin/login', {
    message: null,
    redirect: req.query.redirect,
  });
});

const login = rescue(async (req, res, _next) => {
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
});

const logout = rescue((req, res) => {
  res.clearCookie('token');
  if (!req.cookies || !req.cookies.token) return res.redirect('/login');
  return res.render('admin/logout');
});

const pageCadastro = rescue(async (_req, res) => res.render('admin/cadastro'));

const cadastro = rescue(async (req, res) => {
  const { nome, email, senha, lastName } = req.body;
  await userModel.addUser({ nome, email, senha, lastName });
  res.send('Cadastrado com sucesso');
});

const editUserpage = rescue(async (_req, res) => res.render('admin/editUser'));

const editUser = rescue(async (req, res) => {
  const userId = req.user.id;
  const { nome, senha, email, lastName } = req.body;

  await userModel.update(nome, email, senha, lastName, userId);

  res.send('Usuário atualizado com sucesso');
});

module.exports = {
  login,
  loginForm,
  logout,
  pageCadastro,
  cadastro,
  editUserpage,
  editUser,
};
