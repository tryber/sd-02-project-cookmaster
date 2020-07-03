const recipesModel = require('../models/recipesModel');

async function list(req, res) {
  const { user } = req;

  const recipes = await recipesModel.getRecipes();

  if (!user) {
    return res.render('pages/home', {
      endpoint: 'login',
      name: null,
      recipes,
    });
  }

  return res.render('pages/home', {
    endpoint: 'logout',
    name: user.fullName,
    recipes,
  });
}

async function details(req, res) {
  const { user } = req;
  const { id } = req.params;

  const recipe = await recipesModel.findRecipe({ key: 'id', value: id });

  if (!recipe) {
    return res.redirect('/');
  }

  if (!user) {
    return res.render('pages/details', {
      name: null,
      endpoint: 'login',
      isUser: false,
      recipe,
    });
  }

  if (user.id === recipe.userId) {
    return res.render('pages/details', {
      name: user.fullName,
      endpoint: 'logout',
      isUser: true,
      recipe,
    });
  }

  return res.render('pages/details', {
    name: user.fullName,
    endpoint: 'logout',
    isUser: false,
    recipe,
  });
}

async function newRecipe(req, res) {
  const {
    user: { id, fullName },
    body,
  } = req;

  await recipesModel.createRecipe({ ...body, id, fullName });

  return res.redirect('/');
}

async function editRecipe(req, res) {
  const { id } = req.params;

  const {
    recipeId,
    userId,
    userName,
    recipeName,
    instructions,
    ingredients,
  } = await recipesModel.findRecipe({
    key: 'id',
    value: id,
  });

  if (req.user.id !== userId) {
    return res.redirect('/');
  }

  return res.render('pages/postRecipe', {
    recipeId,
    endpoint: 'logout',
    fullName: userName,
    name: recipeName,
    instructions,
    ingredients,
  });
}

async function deleteRecipe(req, res) {
  const {
    params: { id: recipeId },
    body: { password },
    user: { id: userId },
  } = req;

  const { userId: id } = await recipesModel.findRecipe({ key: 'id', value: recipeId });

  if (id === userId) {
    const status = await recipesModel.deleteRecipe({ recipeId, userId, password });

    if (!status) {
      return res.render('pages/delete', { message: 'senha incorreta', id: recipeId });
    }
  }

  return res.redirect('/');
}

async function updateRecipe(req, res) {
  const { id } = req.params;

  await recipesModel.updateRecipe({ id, ...req.body });

  return res.redirect('/');
}

async function searchRecipe(req, res) {
  const search = req.query.q || null;
  const { user } = req;

  let recipes;

  if (!search) {
    recipes = await recipesModel.getRecipes();
  } else {
    const recipe = await recipesModel.findRecipe({ key: 'name', value: search });
    if (recipe) {
      recipes = [recipe];
    } else {
      recipes = [];
    }
  }

  if (!user) {
    return res.render('pages/search', {
      recipes: recipes || [],
      name: null,
      endpoint: 'login',
    });
  }

  return res.render('pages/search', { recipes, name: user.fullName, endpoint: 'logout' });
}

function createIngredients({ ingredients, add, remove }) {
  let newIngredients = '';

  if (remove && ingredients) {
    const [ingredient, index] = remove.split(',');

    const ingredientsArr = ingredients.split(',');

    ingredientsArr
      .filter((ing, n) => (n !== Number(index) || ing !== ingredient) && ing !== '')
      .forEach((eachIngredient, i) => {
        if (i < ingredientsArr.length - 1) {
          newIngredients += `${eachIngredient},`;
        } else {
          newIngredients += eachIngredient;
        }
      });
  } else {
    newIngredients = ingredients;
  }

  if (add) {
    newIngredients += `${add},`;
  }

  return newIngredients;
}

function recipeForm(req, res) {
  const {
    user: { fullName },
    query: { ingredients, add, remove, name, instructions, recipeId },
  } = req;

  return res.render('pages/postRecipe', {
    recipeId,
    endpoint: 'logout',
    fullName,
    ingredients: createIngredients({ ingredients: ingredients || '', add, remove }),
    name,
    instructions,
  });
}

function deleteForm(req, res) {
  return res.render('pages/delete', { message: null, id: req.params.id });
}

async function myRecipes(req, res) {
  const recipes = await recipesModel.findRecipes({ key: 'user_id', value: req.user.id });

  return res.render('pages/myRecipes', { endpoint: 'logout', name: req.user.fullName, recipes });
}

module.exports = {
  list,
  details,
  newRecipe,
  editRecipe,
  deleteRecipe,
  updateRecipe,
  searchRecipe,
  recipeForm,
  deleteForm,
  myRecipes,
};
