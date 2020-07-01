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


  res.render('recipe/details', {
    recipe,
    user: req.user,
    message: null,
  });
};

const newRecipeForm = (_req, res) => (
  res.render('recipe/form', {
    recipe: { title: '', ingredients: '', directions: '' },
    pageTitle: 'Nova Receita',
    action: '/recipes',
  })
);

const newRecipe = async (req, res) => {
  const { title, ingredients, directions } = req.body;

  const recipesBefore = await Recipe.getAll();

  if (!title || !ingredients || !directions) {
    return res.render('home', {
      user: req.user,
      recipes: recipesBefore,
      message: 'Ocorreu um erro no cadastro da nova receita, é necessário preencher todos os campos',
    });
  }

  const { id: authorId } = req.user;

  try {
    await Recipe.createOne({ title, ingredients, directions, authorId });

    const recipesAfter = await Recipe.getAll();

    res.render('home', {
      user: req.user,
      recipes: recipesAfter,
      message: 'Nova receita cadastrada com sucesso!',
    });
  } catch (_e) {
    res.render('home', {
      user: req.user,
      recipes: recipesBefore,
      message: 'Ocorreu um erro no cadastro da nova receita...',
    });
  }
};

const editRecipeForm = async (req, res) => {
  const idFromUrl = req.url.split('/')[2];

  const recipe = await Recipe.getById(idFromUrl);

  const { authorId } = recipe;
  const { id: userId } = req.user;

  if (authorId !== userId) {
    return res.redirect('/');
  }

  res.render('recipe/form', {
    recipe,
    pageTitle: 'Editar Receita',
    action: `/recipes/${idFromUrl}`,
  });
};

const editRecipe = async (req, res) => {
  const { title, ingredients, directions } = req.body;

  const idFromUrl = Number(req.url.split('/')[2]);

  const recipeBefore = await Recipe.getById(idFromUrl);

  if (!title || !ingredients || !directions) {
    return res.render('recipe/details', {
      recipe: recipeBefore,
      user: req.user,
      message: 'Ocorreu um erro na edição da receita, é necessário preencher todos os campos',
    });
  }

  try {
    await Recipe.editOne({ id: idFromUrl, title, ingredients, directions });

    const recipeAfter = await Recipe.getById(idFromUrl);

    res.render('recipe/details', {
      recipe: recipeAfter,
      user: req.user,
      message: 'Receita editada com sucesso!',
    });
  } catch (_e) {
    res.render('recipe/details', {
      recipe: recipeBefore,
      user: req.user,
      message: 'Ocorreu um erro na edição da receita...',
    });
  }
};

const deleteRecipeForm = async (req, res) => {
  const idFromUrl = req.url.split('/')[2];

  const recipe = await Recipe.getById(idFromUrl);

  const { authorId } = recipe;
  const { id: userId } = req.user;

  if (authorId !== userId) {
    return res.redirect('/');
  }

  res.render('recipe/delete', {
    message: null,
    action: `/recipes/${idFromUrl}/delete`,
  });
};

const deleteRecipe = async (req, res) => {
  const { userPassword, body: { password } } = req;

  const idFromUrl = Number(req.url.split('/')[2]);

  if (password !== userPassword) {
    return res.render('recipe/delete', {
      message: 'Senha incorreta. Por favor, tente novamente',
      action: `/recipes/${idFromUrl}/delete`,
    });
  }

  const recipesBefore = await Recipe.getAll();

  try {
    await Recipe.deleteOne(idFromUrl);

    const recipesAfter = await Recipe.getAll();

    res.render('home', {
      recipes: recipesAfter,
      user: req.user,
      message: 'Receita excluída com sucesso!',
    });
  } catch (_e) {
    res.render('home', {
      recipes: recipesBefore,
      user: req.user,
      message: 'Ocorreu um erro na exclusão da receita...',
    });
  }
};

// const searchRecipesForm = (_req, res) => {
//   res.render('recipe/search', {
//     recipes: [],
//   });
// };

const searchRecipes = async (req, res) => {
  const { q } = req.query;

  const recipes = await Recipe.searchByTitle(q);

  res.render('recipe/search', {
    recipes,
  });
};

module.exports = {
  listRecipes,
  showRecipeDetails,
  newRecipeForm,
  newRecipe,
  editRecipeForm,
  editRecipe,
  deleteRecipeForm,
  deleteRecipe,
  searchRecipes,
};
