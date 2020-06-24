const { SESSIONS } = require('../middlewares/auth');
const recipeModel = require('../models/recipeModel');

const listRecipes = async (req, res) => {
  const recipes = await recipeModel.getAllRecipes();
  if (req.user) {
    const { name, lastName } = req.user;
    return res.render('home', { recipes, userName: `${name} ${lastName}` });
  }
  return res.render('non-authenticated/home', { recipes });
};

const showRecipe = async (req, res) => {
  const { id } = req.params;
  const recipe = await recipeModel.getSingleRecipe(id);
  if (req.user) {
    const { name, lastName } = req.user;
    return res.render('recipeDetails', { recipe, userId: req.user.id, userName: `${name} ${lastName}` });
  }
  return res.render('non-authenticated/recipeDetails', { recipe });
};

const newRecipeForm = async (req, res) => {
  const { token = '' } = req.cookies || {};

  if (SESSIONS[token]) {
    const { name, lastName } = req.user;
    return res.render('newRecipe', {
      message: null,
      userName: `${name} ${lastName}`,
    });
  }

  return res.render('/login', {
    message: 'Faça login ou cadastre-se para poder cadastrar uma nova receita',
  });
};

const newRecipe = async (req, res, _next) => {
  const {
    recipe,
    ingredients,
    instructions,
  } = req.body;

  const { id: userId, name, lastName } = req.user;

  if (!recipe || !ingredients || !instructions) {
    return res.render('newRecipe', {
      message: 'Preencha todos os campos',
      userName: `${name} ${lastName}`,
    });
  }

  const registeredRecipeByUser = await recipeModel
    .recipeAlreadyRegisteredByUser(userId, recipe);

  if (registeredRecipeByUser > 0) {
    return res.render('newRecipe', {
      message: 'Você já cadastrou uma receita com esse nome. Escolha outro nome.',
      userName: `${name} ${lastName}`,
    });
  }

  await recipeModel.registerNewRecipe({ recipe, ingredients, instructions, userId });

  return res.redirect('/');
};

module.exports = {
  listRecipes,
  showRecipe,
  newRecipeForm,
  newRecipe,
};
