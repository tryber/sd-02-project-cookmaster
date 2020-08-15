const userModel = require('../models/userModel');
const registrationModel = require('../models/registrationModel');

const checkUserData = async () => {
  const userData = await userModel.findByEmail('user@company.com');
  console.log(userData);
};

const displayRegistration = async (req, res) => {
  return res.render('register', { message: '', redirect: false });
}

const registerUser = async (req, res) => {
  const { message, redirect } = await registrationModel.registerNewUser(req.body);
  console.log(message, redirect);
  return res.render('register', { message, redirect });
};

module.exports = {
  checkUserData,
  displayRegistration,
  registerUser,
};
