const mysqlx = require('@mysql/xdevapi');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const getSession = () => (
  mysqlx.getSession({
    user: 'root',
    password: process.env.DATABASE_PASSWORD,
    host: 'localhost',
    port: 33060,
    schema: 'cook_master',
  }));

const connection = () => getSession().then((session) => session.getSchema('cook_master'));

module.exports = {
  getSession,
  connection,
}
