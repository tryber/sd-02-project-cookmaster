const { getSession } = require('./conection');

const getAll = async () =>
  getSession()
  .then((session) => session.sql('select r.id, u.nome, r.nome from receitas r inner join users u on r.user_id = u.id').execute())
  .then((results) => results.fetchAll())
  .then((receitas) => receitas.map(([receitaId, userName, receitaName]) =>
    ({ receitaId, userName, receitaName })));

const getAllById = async (id) =>
  getSession()
  .then((session) => session.sql('select r.nome from receitas r inner join users u on r.user_id = u.id where u.id = ?')
  .bind(id)
  .execute(),
  )
  .then((results) => results.fetchAll())
  .then((receitas) => receitas.map(([nome]) => ({ nome })));

const getById = async (id) =>
  getSession()
    .then((session) => session.sql(`select u.nome, r.nome, r.ingredientes, r.modo_de_preparar, r.user_id
      from receitas r inner join users u on r.user_id = u.id where r.id = ?`)
    .bind(id)
    .execute(),
    )
    .then((results) => results.fetchAll()[0])
    .then((receita) => {
      if (!receita) return null;
      const [userName, receitaName, ingredientes, modoDePreparar, user_id] = receita;
      return { userName, receitaName, ingredientes, modoDePreparar, user_id };
    });

const addReceita = async (nome, ingredientes, modoDePreparar, userId) =>
  getSession()
    .then((session) => session.sql(`insert into receitas(nome, ingredientes, modo_de_preparar, user_id)
      values(?, ?, ?, ?)`)
      .bind(nome)
      .bind(ingredientes)
      .bind(modoDePreparar)
      .bind(userId)
      .execute(),
    );

const upReceita = async (nome, ingredientes, modoDePreparar, id) =>
  getSession()
    .then((session) => session.sql(`update receitas set nome = ?, ingredientes = ?, modo_de_preparar = ?
      where id = ?`)
      .bind(nome)
      .bind(ingredientes)
      .bind(modoDePreparar)
      .bind(id)
      .execute(),
    );

const deleteById = async (id) =>
  getSession()
    .then((session) => session.sql('delete from receitas where id = ?')
    .bind(id)
    .execute(),
    );

const search = async (query) =>
  getSession()
    .then((session) => session.sql(`select r.nome, u.nome from receitas r
      inner join users u on r.user_id = u.id where r.nome like ?`)
    .bind(query)
    .execute(),
    )
    .then((results) => results.fetchAll())
    .then((receitas) => receitas.map(([userName, receitaName]) =>
      ({ userName, receitaName })));

const findByUserId = (id) =>
  getSession()
    .then((session) => session.sql(`select r.nome from receitas r
      inner join users u on r.user_id = u.id where u.id ?`)
    .bind(id)
    .execute(),
    );


module.exports = {
  getAll,
  getAllById,
  getById,
  addReceita,
  upReceita,
  deleteById,
  search,
  findByUserId,
};
