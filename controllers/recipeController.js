const { SESSIONS } = require('../middlewares/auth');
const recipeModel = require('../models/recipeModel');
const userModel = require('../models/userModel');

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

const newRecipe = async (req, res) => {
  const { recipe, ingredients, instructions } = req.body;
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

  const newRecipeId = await recipeModel
    .registerNewRecipe({ recipe, ingredients, instructions, userId })
    .then(({ getAutoIncrementValue }) => getAutoIncrementValue());

  return res.redirect(`/recipes/${newRecipeId}`);
};

const editRecipeForm = async (req, res) => {
  const { token = '' } = req.cookies || {};
  const { id: recipeId } = req.params;
  const recipe = await recipeModel.getSingleRecipe(recipeId);

  const { id: userId, name, lastName } = req.user;
  if (SESSIONS[token] && recipe.userId === userId) {
    return res.render('editRecipe', {
      message: null,
      recipe,
      userName: `${name} ${lastName}`,
    });
  }

  return res.redirect(`/recipes/${recipeId}`);
};

const editRecipe = async (req, res) => {
  const {
    recipe,
    ingredients,
    instructions,
  } = req.body;
  const { id: recipeId } = req.params;

  const { name, lastName } = req.user;

  if (!recipe || !ingredients || !instructions) {
    return res.render('editRecipe', {
      message: 'Preencha todos os campos',
      userName: `${name} ${lastName}`,
    });
  }

  await recipeModel
    .updateRecipe({ recipe, ingredients, instructions, recipeId });

  return res.redirect(`/recipes/${recipeId}`);
};

const deleteRecipeForm = async (req, res) => {
  const { token = '' } = req.cookies || {};
  const { id: recipeId } = req.params;
  const recipe = await recipeModel.getSingleRecipe(recipeId);

  const { id: userId } = req.user;
  if (SESSIONS[token] && recipe.userId === userId) {
    return res.render('deleteRecipe', {
      message: null,
      recipeId,
    });
  }

  return res.redirect('/');
};

const deleteRecipe = async (req, res) => {
  const { password } = req.body;
  const { email } = req.user;
  const { id: recipeId } = req.params;

  const correctPassword = await userModel.checkPassword(email, password);

  if (!correctPassword) {
    return res.render('deleteRecipe', {
      message: 'Senha incorreta. Por favor, tente novamente',
      recipeId,
    });
  }

  await recipeModel.deleteRecipeFromTable(recipeId);

  return res.redirect('/');
};

const searchRecipePage = async (req, res, next) => {
  const { q } = req.query;

  if (q) return next();

  if (req.user) {
    const { name, lastName } = req.user;
    return res.render('searchRecipe', {
      message: null,
      recipes: null,
      userName: `${name} ${lastName}`,
    });
  }
  return res.render('non-authenticated/searchRecipe', {
    message: null,
    recipes: null,
  });
};

const searchRecipe = async (req, res) => {
  const { q } = req.query;

  const recipes = await recipeModel.findRecipes(q);

  if (req.user) {
    const { name, lastName } = req.user;
    return res.render('searchRecipe', {
      message: !recipes.length && 'Nenhuma receita foi encontrada.',
      recipes,
      userName: `${name} ${lastName}`,
    });
  }
  return res.render('non-authenticated/searchRecipe', {
    message: !recipes.length && 'Nenhuma receita foi encontrada.',
    recipes,
  });
};

const showUserRecipes = async (req, res) => {
  const { id, name, lastName } = req.user;

  const recipes = await recipeModel.getUserRecipes(id);

  return res.render('myRecipes', {
    message: !recipes.length && 'Você ainda não cadastrou nenhuma receita',
    recipes,
    userName: `${name} ${lastName}`,
  });
};

module.exports = {
  listRecipes,
  showRecipe,
  newRecipeForm,
  newRecipe,
  editRecipeForm,
  editRecipe,
  deleteRecipeForm,
  deleteRecipe,
  searchRecipePage,
  searchRecipe,
  showUserRecipes,
};
