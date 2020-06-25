const receitaModel = require('../models/receitaModel');
const userModel = require('../models/userModel');
const { getUser } = require('../middlewares/auth');
const rescue = require('express-rescue');


const getAllReceitas = rescue(async (req, res) => {
  let user;
  const receitas = await receitaModel.getAll();
  getUser(req).then((data) => user = data);
  return res.render('home', { user, receitas, message: null });
});

const getReceitaById = rescue(async (req, res) => {
  const id = req.params.id;

  const receita = await receitaModel.getById(id);
  if (!receita) {
    return res.render('receitaDetails', { receita, message: 'Nenhuma receita foi encontrada!' });
  }
  return res.render('receitaDetails', { receita, message: null });
});

const addReceita = rescue(async (req, res) => {
  const { nome, ingredientes, modo_de_preparar } = req.body;
  const user_id = req.user.id;
  await receitaModel.addReceita(nome, ingredientes, modo_de_preparar, user_id);

  res.send('adicionado com sucesso');
});

const pageNewReceita = rescue(async (_req, res) => {
  return res.render('admin/newReceita');
});

const pageEditReceita = rescue(async (req, res) => {
  const id = req.params.id;
  const receita = await receitaModel.getById(id);
  if (!receita) res.send('Receita não foi encontrado');
  return res.render('admin/editReceita', { pathRedirect: `/recipes/${id}` } );
});

const updateReceita = rescue(async (req, res) => {
  const { nome, ingredientes, modo_de_preparar } = req.body;
  const id = req.params.id;
  await receitaModel.upReceita(nome, ingredientes, modo_de_preparar, id);

  res.send('atualizado com sucesso');
});

const pageDelReceita = rescue(async (req, res) => {
  const id = req.params.id;

  return res.render('admin/deleteReceita', { pathRedirect: `/recipes/${id}/delete`, message: null });
});

const deleteReceita = rescue(async (req, res) => {
  const { input_password } = req.body;
  const user_id = req.user.id;
  const user = await userModel.findById(user_id);
  const id = req.params.id;

  if (input_password !== user.senha) {
    return res.render('admin/deleteReceita',
      { pathRedirect: `/recipes/${id}/delete`, message: 'Senha está incorreta' });
  }

  await receitaModel.deleteById(id);

  res.send('deletado com sucesso');
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
  const user_id = req.user.id;
  const receitas = await receitaModel.getAllById(user_id);
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
  minhasReceitas
};
