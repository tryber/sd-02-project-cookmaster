const postRecipe = require('../models/postRecipe');

const postNewRecipe = async (req, res) => {
  const { id } = req.user;
  const validate = await postRecipe({ ...req.body, id });
  if (typeof (validate) === 'string') return res.render('admin/formRecipe', { message: validate });
  return res.redirect('/');
};

module.exports = postNewRecipe;
