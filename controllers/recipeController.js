const Recipe = require('../models/recipeModel');

const listRecipes = async (req, res) => {
  const recipes = await Recipe.getAll();

  res.render('home', {
    recipes,
    user: req.user,
    message: null,
  });
};

const showRecipeDetails = async (req, res) => {
  const idFromUrl = req.url.split('/')[2];

  const recipe = await Recipe.getById(idFromUrl);


  res.render('recipe/details', { recipe, user: req.user });
};

const newRecipeForm = (req, res) => (
  res.render(
    'recipe/new',
    { message: null },
  )
);

const newRecipe = async (req, res) => {
  const { title, ingredients, directions } = req.body;

  // if (!title || !ingredients || !directions)
  //   return res.render('recipe/new', {
  //     message: 'Preencha todos os campos',
  //   });

  const { id: authorId } = req.user;

  try {
    await Recipe.createOne({ title, ingredients, directions, authorId });

    const recipes = await Recipe.getAll();

    res.render('home', {
      user: req.user,
      recipes,
      message: 'Nova receita cadastrada com sucesso!',
    });
  } catch (err) {
    console.error(err);

    const recipes = await Recipe.getAll();

    res.render('home', {
      user: req.user,
      recipes,
      message: 'Ocorreu um erro no cadastro da nova receita...',
    });
  }

  // const user = await userModel.findByEmail(email);

  // if (user)
  //   return res.render('admin/register', {
  //     message: 'Email já está cadastrado, insira outro',
  //   });

  // try {
  //   await userModel.registerNewUser({ email, password, firstName, lastName });

  //   res.render('admin/register', {
  //     message: 'Novo cadastro realizado com sucesso!',
  //   });
  // } catch (e) {
  //   console.error(e);
  //   res.render('admin/register', {
  //     message: 'Ocorreu um erro, tente outra vez',
  //   });
  // }
};

module.exports = {
  listRecipes,
  showRecipeDetails,
  newRecipeForm,
  newRecipe,
};
