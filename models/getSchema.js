const getSession = require('./connection');

const getSchema = () => getSession().then((session) =>
  session.getSchema('project_cookmaster'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

module.exports = getSchema;
