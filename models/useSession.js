const mysqlx = require('@mysql/xdevapi');

const useSession = () => mysqlx.getSession({
  user: 'root',
  password: 'password',
  host: 'localhost',
  port: 33060,
  schema: 'cookmaster',
});

module.exports = useSession;
