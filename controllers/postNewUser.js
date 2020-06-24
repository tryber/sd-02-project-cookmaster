const { postUser } = require('../models/postUser');

const postNewUser = async (req, res) => {
  const validate = await postUser(req.body);
  if (typeof (validate) === 'string') return res.render('formUser', { message: validate });
  return res.redirect('/login');
};

module.exports = postNewUser;
