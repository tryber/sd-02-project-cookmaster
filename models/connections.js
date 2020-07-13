const mysqlx = require('@mysql/xdevapi');

const connection = () => (
  mysqlx.getSession({
    user: 'root',
    password: 'backendisdangerous',
    host: 'localhost',
    port: 33060,
    schema: 'cookmaster',
  })
    .catch((err) => {
      console.error(err.message);
      process.exit(1);
    })
);

module.exports = connection;
