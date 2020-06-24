const getNewUser = (_req, res) =>
  (res.render('admin/formRecipe', { message: false }));

module.exports = getNewUser;
