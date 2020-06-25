const receitaModel = require('../models/receitaModel');
const userModel = require('../models/userModel');
const { getUser } = require('../middlewares/auth');
const rescue = require('express-rescue');


const getAllReceitas = rescue(async (req, res) => {
  const receitas = await receitaModel.getAll();
  const user =  await getUser(req).then((data) => data);
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
  const userId = req.user.id;
  await receitaModel.addReceita(nome, ingredientes, modo_de_preparar, userId);

  res.send('adicionado com sucesso');
});

const pageNewReceita = async (_req, res) => {
  return res.render('admin/newReceita');
};

const pageEditReceita = rescue(async (req, res) => {
  const id = req.params.id;
  const receita = await receitaModel.getById(id);
  if (!receita) res.send('Receita não foi encontrado');
  return res.render('admin/editReceita', { pathRedirect: `/recipes/${id}` });
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
  const { inputPassword } = req.body;
  const user_id = req.user.id;
  const user = await userModel.findById(user_id);
  const id = req.params.id;

  if (inputPassword !== user.senha) {
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
