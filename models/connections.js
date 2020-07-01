const mysqlx = require('@mysql/xdevapi');
const { json } = require('body-parser');

const connection = () => {
  return mysqlx.getSession({
    user: 'root',
    password: '123456',
    host: 'localhost',
    port: 33060,
    schema: 'cookmaster',
  })
};

const schema = () =>
  connection()
    .then((session) => {
      return session;
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });

module.exports = { connection, schema };
