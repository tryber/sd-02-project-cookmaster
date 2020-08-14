const mysqlx = require('@mysql/xdevapi');

const connection = () => {
  return mysqlx.getSession({
    user: 'root',
    password: 'P@ssw0rd',
    host: 'localhost',
    port: 33060,
    schema: 'project_cookmaster',
  })
  .then((session) => session.getSchema('project_cookmaster'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
};

module.exports = connection;
