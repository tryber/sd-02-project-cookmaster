const mysqlx = require('@mysql/xdevapi');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const connection = () => (
  mysqlx.getSession({
    user: 'root',
    password: process.env.DATABASE_PASSWORD,
    host: 'localhost',
    port: 33060,
    schema: 'cook_master',
  })
    .then(session => {
      return session.getSchema('cook_master');
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    }));

module.exports = connection;
