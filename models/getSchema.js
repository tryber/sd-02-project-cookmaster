const requestSession = require('./requestSession');

const getSchema = async () =>
  requestSession()
    .then((session) => session.getSchema('cookie_master'))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });

module.exports = getSchema;
