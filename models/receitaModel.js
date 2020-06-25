const { getSession } = require('./conection');

const getAll = async () =>
  getSession()
  .then(session => session.sql('select u.nome, r.nome from receitas r inner join users u on r.user_id = u.id').execute())
  .then(results => results.fetchAll())
  .then((receitas) => receitas.map(([user_name, receita_name]) => ({ user_name, receita_name })));

const getAllById = async (id) =>
  getSession()
  .then(session => session.sql('select r.nome from receitas r inner join users u on r.user_id = u.id where u.id = ?')
  .bind(id)
  .execute()
  )
  .then(results => results.fetchAll())
  .then((receitas) => receitas.map(([nome]) => ({ nome })));

const getById = async (id) =>
  getSession()
    .then(session => session.sql(`select u.nome, r.nome, r.ingredientes, r.modo_de_preparar
      from receitas r inner join users u on r.user_id = u.id where r.id = ?`)
    .bind(id)
    .execute()
    )
    .then((results) => results.fetchAll()[0])
    .then((receita) => {
      if (!receita) return null;
      const [user_name, receita_name, ingredientes, modo_de_preparar] = receita;
      return { user_name, receita_name, ingredientes, modo_de_preparar };
    })

const addReceita = async (nome, ingredientes, modo_de_preparar, user_id) =>
  getSession()
    .then(session => session.sql(`insert into receitas(nome, ingredientes, modo_de_preparar, user_id)
      values(?, ?, ?, ?)`)
      .bind(nome)
      .bind(ingredientes)
      .bind(modo_de_preparar)
      .bind(user_id)
      .execute()
    );

const upReceita = async (nome, ingredientes, modo_de_preparar, id) =>
  getSession()
    .then(session => session.sql(`update receitas set nome = ?, ingredientes = ?, modo_de_preparar = ?
      where id = ?`)
      .bind(nome)
      .bind(ingredientes)
      .bind(modo_de_preparar)
      .bind(id)
      .execute()
    );

const deleteById = async (id) =>
  getSession()
    .then(session => session.sql(`delete from receitas where id = ?`)
    .bind(id)
    .execute()
    );

const search = async (query) =>
  getSession()
    .then(session => session.sql(`select r.nome, u.nome from receitas r
      inner join users u on r.user_id = u.id where r.nome like ?`)
    .bind(query)
    .execute()
    )
    .then((results) => results.fetchAll())
    .then((receitas) => receitas.map(([user_name, receita_name]) =>
      ({ user_name, receita_name })));

const findByUserId = (id) =>
  getSession()
    .then(session => session.sql(`select r.nome from receitas r
      inner join users u on r.user_id = u.id where u.id ?`)
    .bind(id)
    .execute()
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
