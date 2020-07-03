const registerModel = require('../models/registerModel');
const userModel = require('../models/userModel');

async function register(req, res) {
  try {
    const {
      ok,
      error: { email, password, confirm, firstName, lastName },
    } = await registerModel.register(req.body);

    if (ok) {
      return res.render('pages/login', {
        message: 'Cadastro efetuado com sucesso!',
        redirect: null,
      });
    }

    return res.render('pages/register', {
      error: {
        email,
        password,
        confirm,
        firstName,
        lastName,
      },
    });
  } catch (err) {
    throw new Error(err);
  }
}

async function userForm(req, res) {
  const { email, password, firstName, lastName } = await userModel.findUser({
    key: 'id',
    value: req.user.id,
  });

  return res.render('pages/editUser', {
    error: {
      email: null,
      password: null,
      confirm: null,
      firstName: null,
      lastName: null,
    },
    email,
    password,
    firstName,
    lastName,
  });
}

async function updateUser(req, res) {
  const {
    ok,
    error: { email, password, confirm, firstName, lastName },
  } = await registerModel.update({ ...req.body, userId: req.user.id });

  if (ok) {
    return res.redirect('/');
  }

  return res.render('pages/editUser', {
    error: {
      email,
      password,
      confirm,
      firstName,
      lastName,
    },
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
}

module.exports = {
  register,
  userForm,
  updateUser,
};
