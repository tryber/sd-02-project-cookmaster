const useSession = require('./useSession');

const connection = () =>
  useSession()
    .then((session) => session.getSchema('cookmaster'))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });

module.exports = connection;
