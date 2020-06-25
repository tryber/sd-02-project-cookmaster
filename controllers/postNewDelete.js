const postDelete = require('../models/postDelete');

const postNewDelete = async (req, res) => {
  const { id } = req.params;
  await postDelete(id);
  res.redirect('/');
};

module.exports = postNewDelete;
