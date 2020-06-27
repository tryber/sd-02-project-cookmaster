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

const newUser = async (req, res) => {
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

  await userModel.registerNewUser({ email, password, firstName, lastName });

  return login(req, res);
};

const editUserForm = async (req, res) => {
  const { id } = req.user;

  const user = await userModel.findUser(id);

  return res.render('editUser', { user, message: null });
};

const editUser = async (req, res) => {
  const { id } = req.user;
  const {
    email, password, confirm_password: confirmPassword, first_name: firstName, last_name: lastName,
  } = req.body;

  const user = await userModel.findUser(id);

  if (!email || !password || !confirmPassword || !firstName || !lastName) {
    return res.render('editUser', { message: 'Preencha todos os campos', user });
  }

  if (password !== confirmPassword) {
    return res.render('editUser', {
      message: 'Preencha a mesma senha nos dois campos',
      user,
    });
  }

  const searchTypedEmail = await userModel.findUser(email);

  const { email: loggedUserEmail } = user;
  const { email: alreadyRegisteredEmail } = searchTypedEmail;

  if (alreadyRegisteredEmail && alreadyRegisteredEmail !== loggedUserEmail) {
    return res.render('editUser', {
      message: 'Email já cadastrado, escolha outro',
      user,
    });
  }

  await userModel.updateUser({ id, email, password, firstName, lastName });

  return res.redirect('/admin');
};

module.exports = {
  login,
  loginForm,
  logout,
  newUser,
  registerForm,
  editUserForm,
  editUser,
};
