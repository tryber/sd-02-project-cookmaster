const mysqlx = require("@mysql/xdevapi");

const config = {
  user: "root",
  password: "password",
  host: "localhost",
  port: 33060,
  schema: "cep_lookup",
  socketPath: "/var/run/mysqld/mysqld.sock",
};

const connection = () => {
  return mysqlx
    .getSession(config)
    .then((session) => {
      return session.getSchema("cep_lookup");
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};

module.exports = connection;
