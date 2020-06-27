const mysqlx = require('@mysql/xdevapi');

const config = {
  user: 'root',
  password: 'password',
  host: 'localhost',
  port: 33060,
  schema: 'cookmaster',
  socketPath: '/var/run/mysqld/mysqld.sock',
};

function connection() {
  return mysqlx
    .getSession(config)
    .then((session) => session.getSchema('cookmaster'))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = connection;
