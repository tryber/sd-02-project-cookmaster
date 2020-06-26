const receitaModel = require('../models/receitaModel');
const userModel = require('../models/userModel');
const { getUser } = require('../middlewares/auth');
const rescue = require('express-rescue');


const getAllReceitas = rescue(async (req, res) => {
  const receitas = await receitaModel.getAll();
  const user = await getUser(req).then((data) => data);
  const links = receitas.map((receita) => `/recipes/${receita.receitaId}`);
  return res.render('home', { user, receitas, links, message: null });
});

const getReceitaById = rescue(async (req, res) => {
  const id = req.params.id;
  const user = req.user;
  let userId;
  if (user) {
    userId = user.id;
  }

  const receita = await receitaModel.getById(id);

  if (!receita) {
    res.send('receita não encontrada');
  }

  const permission = (receita.userId === userId);
  const links = {
    edit: `window.location.pathname="/recipes/${id}/edit"`,
    del: `window.location.pathname="/recipes/${id}/delete"`,
  };

  if (!receita) {
    return res.render('receitaDetails',
      { receita, permission, links, message: 'Nenhuma receita foi encontrada!' },
    );
  }

  return res.render('receitaDetails', { receita, permission, links, message: null });
});

const addReceita = rescue(async (req, res) => {
  const { nome, ingredientes, modoDePreparar } = req.body;
  const userId = req.user.id;
  await receitaModel.addReceita(nome, ingredientes, modoDePreparar, userId);

  res.send('adicionado com sucesso');
});

const pageNewReceita = rescue(async (_req, res) => res.render('admin/newReceita'));


const pageEditReceita = rescue(async (req, res) => {
  const id = req.params.id;
  const receita = await receitaModel.getById(id);
  if (!receita) res.send('Receita não foi encontrado');
  return res.render('admin/editReceita', { pathRedirect: `/recipes/${id}` });
});

const updateReceita = rescue(async (req, res) => {
  const { nome, ingredientes, modoDePreparar } = req.body;
  const id = req.params.id;

  const receita = await receitaModel.getById(id);
  const userId = req.user.id;
  if (receita.userId !== userId) {
    res.redirect('/');
  }

  await receitaModel.upReceita(nome, ingredientes, modoDePreparar, id);

  res.redirect(`/recipes/${id}`);
});

const pageDelReceita = rescue(async (req, res) => {
  const id = req.params.id;

  return res.render('admin/deleteReceita', { pathRedirect: `/recipes/${id}/delete`, message: null });
});

const deleteReceita = rescue(async (req, res) => {
  const { inputPassword } = req.body;
  const userId = req.user.id;
  const user = await userModel.findById(userId);
  const id = req.params.id;

  if (inputPassword !== user.senha) {
    return res.render('admin/deleteReceita',
      { pathRedirect: `/recipes/${id}/delete`, message: 'Senha está incorreta' });
  }

  await receitaModel.deleteById(id);

  res.redirect('/');
});

const search = rescue(async (req, res) => {
  const { q } = req.query;
  if (q) {
    const receitas = await receitaModel.search(q);
    return res.render('admin/search', { receitas });
  }
  return res.render('admin/search', { receitas: null });
});

const minhasReceitas = rescue(async (req, res) => {
  const userId = req.user.id;
  const receitas = await receitaModel.getAllById(userId);
  return res.render('admin/minhasReceitas', { receitas });
});

module.exports = {
  getAllReceitas,
  getReceitaById,
  addReceita,
  pageNewReceita,
  pageEditReceita,
  updateReceita,
  pageDelReceita,
  deleteReceita,
  search,
  minhasReceitas,
};
