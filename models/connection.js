const mysqlx = require('@mysql/xdevapi');
// isso me dá acesso ao banco de dados
const getSession = () => (
  mysqlx.getSession({
    host: 'localhost',
    user: 'root',
    port: 33060,
    password: 'password',
    schema: 'cook_master'
  })
);
// mudei a porta de 33060 pra 3306
const acessTable = (table) => (
  getSession()
    .then((session) => session.getSchema('cook_master'))
    .then((schema) => schema.getTable(table))
);

module.exports = {
  getSession,
  acessTable,
};
