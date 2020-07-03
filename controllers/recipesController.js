const recipesModel = require('../models/recipesModel');

async function list(req, res) {
  try {
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
  } catch (err) {
    throw new Error(err);
  }
}

async function details(req, res) {
  try {
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
  } catch (err) {
    throw new Error(err);
  }
}

async function newRecipe(req, res) {
  try {
    const {
      user: { id, fullName },
      body,
    } = req;

    await recipesModel.createRecipe({ ...body, id, fullName });

    return res.redirect('/');
  } catch (err) {
    throw new Error(err);
  }
}

async function editRecipe(req, res) {
  try {
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
  } catch (err) {
    throw new Error(err);
  }
}

async function deleteRecipe(req, res) {
  try {
    const {
      params: { id: recipeId },
      body: { password },
      user: { id: userId },
    } = req;

    const { userId: user_id } = await recipesModel.findRecipe({ key: 'id', value: recipeId });

    if (user_id === userId) {
      const status = await recipesModel.deleteRecipe({ recipeId, userId, password });

      if (!status) {
        return res.render('pages/delete', { message: 'senha incorreta', id: recipeId });
      }
    }

    return res.redirect('/');
  } catch (err) {
    throw new Error(err);
  }
}

async function updateRecipe(req, res) {
  try {
    const { id } = req.params;

    await recipesModel.updateRecipe({ id, ...req.body });

    return res.redirect('/');
  } catch (err) {
    throw new Error(err);
  }
}

async function searchRecipe(req, res) {
  try {
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

    if (!user)
      return res.render('pages/search', {
        recipes: recipes || [],
        name: null,
        endpoint: 'login',
      });

    return res.render('pages/search', { recipes, name: user.fullName, endpoint: 'logout' });
  } catch (err) {
    throw new Error(err);
  }
}

function createIngredients({ ingredients, add, remove }) {
  let newIngredients = '';

  if (remove && ingredients) {
    const [ingredient, index] = remove.split(',');

    const ingredientsArr = ingredients.split(',');

    ingredientsArr
      .filter(
        (ingredient_n, n) =>
          (n !== Number(index) || ingredient_n !== ingredient) && ingredient_n !== '',
      )
      .forEach((each_ingredient, i) => {
        if (i < ingredientsArr.length - 1) {
          newIngredients += each_ingredient + ',';
        } else {
          newIngredients += each_ingredient;
        }
      });
  } else {
    newIngredients = ingredients;
  }

  if (add) {
    newIngredients += add + ',';
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
