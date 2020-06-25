const updateRecipe = require('../models/updateRecipe');

const postNewEdit = async (req, res) => {
  const { id } = req.user;
  await updateRecipe({ ...req.body, id })
    .then(({ getAffectedItemsCount }) => getAffectedItemsCount());
  return res.redirect(id);
};

module.exports = postNewEdit;
