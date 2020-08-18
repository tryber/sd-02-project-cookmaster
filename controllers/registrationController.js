const registrationModel = require('../models/registrationModel');

const displayRegistration = async (_req, res) => res.render('register', { message: '', redirect: false });

const registerUser = async (req, res) => {
  const { message, redirect } = await registrationModel.registerNewUser(req.body);
  return res.render('register', { message, redirect });
};

module.exports = {
  displayRegistration,
  registerUser,
};
