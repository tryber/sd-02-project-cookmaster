const { authMiddleware, getUser } = require('./auth');

module.exports = {
  auth: authMiddleware,
  getUser,
};
