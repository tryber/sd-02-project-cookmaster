const mysqlx = require('@mysql/xdevapi');

const requestSession = async () => mysqlx
  .getSession({
    user: 'root',
    password: '',
    host: 'localhost',
    port: 33060,
  })
  .then((session) => session);

module.exports = requestSession;
