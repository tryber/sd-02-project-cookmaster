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

const userRegistration = async (req, res, next) => {
  return {};
}

const regexForm = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const emailTest = emailRegex.test(email);
  if (emailTest) {
    return true;
  }
  return false;
}

const verifyNewForm = async (req, res) => {
  const { name, lastName, email, password } = req.body;
  const testForm = regexForm(email);

  const user = await userModel.findByEmail(email);
  if (!user && name && lastName && testForm) {
    const query = `INSERT INTO users (name, last_name, email, password)
    VALUES
    ('${name}', '${lastName}', '${email}', '${password}');`;
    await userModel.createUser(query);
    return res.render('./admin/newUser', { message: 'Usuário criado com sucesso. Realize seu Login', login: true });
  }

  return res.render('./admin/newUser', { message: null || 'E-mail inválido, digite um e-mail válido.', login: false });
}

const createNew = (req, res) => {
  const { name, lastName, email, password } = req.body;
}

module.exports = {
  login,
  loginForm,
  logout,
  verifyNewForm,
  createNew,
};
