const registerModel = require('../models/registerModel');

async function register(req, res) {
  try {
    const {
      ok,
      error: { email, password, confirm, firstName, lastName },
    } = await registerModel.register(req.body);

    if (ok)
      return res.render('admin/login', {
        message: 'Cadastro efetuado com sucesso!',
        redirect: null,
      });

    return res.render('admin/register', {
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

module.exports = {
  register,
};
