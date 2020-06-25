const mysqlx = require('@mysql/xdevapi');

const getSession = () =>
  mysqlx
    .getSession({
      user: 'root',
      password: 'qwe123!@#',
      host: 'localhost',
      port: 33060,
      schema: 'CookMaster',
    });

const connection = async () =>
  getSession()
    .then((session) => session.getSchema('CookMaster'))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });

module.exports = {
  connection,
  getSession,
};
