const connection = require('./connection');

const getNewRecipe = (recipeData) => {
  const {
    id, title, ingredients, directions, authorId, authorFirstName, authorLastName,
  } = recipeData;

  const authorFullName = [authorFirstName, authorLastName].join(' ');

  return {
    id,
    title,
    ingredients,
    directions,
    authorId,
    authorName: authorFullName,
  };
};

/**
 * Busca todas as receitas do banco.
 */
const getAll = async () => (
  connection()
    .then((session) =>
      session
        .sql(`
          SELECT
            R.id,
            R.title,
            R.ingredients,
            R.directions,
            R.author_id,
            U.first_name,
            U.last_name
          FROM cookmaster.recipes AS R
          INNER JOIN cookmaster.users AS U
          ON R.author_id = U.id;
        `)
        .execute(),
    )
    .then((results) => results.fetchAll())
    .then((recipes) =>
      recipes.map(([
        id, title, ingredients, directions, authorId, authorFirstName, authorLastName,
      ]) =>
        getNewRecipe({
          id,
          title,
          ingredients,
          directions,
          authorId,
          authorFirstName,
          authorLastName,
        }),
      ),
    )
    .catch((err) => {
      console.error(err);
    })
);

const getById = async (id) => {
  const allRecipes = await getAll();

  return allRecipes
    .find((recipe) => recipe.id === Number(id));
};

const createOne = async ({ title, ingredients, directions, authorId }) => (
  connection()
    .then((session) =>
      session
        .getSchema('cookmaster')
        .getTable('recipes')
        .insert(['title', 'ingredients', 'directions', 'author_id'])
        .values(title, ingredients, directions, authorId)
        .execute(),
    )
    .catch((err) => {
      console.error(err);
    })
);

const editOne = async ({ id, title, ingredients, directions }) => (
  connection()
    .then((session) =>
      session
        .getSchema('cookmaster')
        .getTable('recipes')
        .update()
        .where('id = :id')
        .bind('id', id)
        .set('title', title)
        .set('ingredients', ingredients)
        .set('directions', directions)
        .execute(),
    )
    .catch((err) => {
      console.error(err);
    })
);

const deleteOne = async (id) => (
  connection()
    .then((session) =>
      session
        .getSchema('cookmaster')
        .getTable('recipes')
        .delete()
        .where('id = :id')
        .bind('id', id)
        .execute(),
    )
    .catch((err) => {
      console.error(err);
    })
);

const searchByTitle = async (q) => {
  if (q === '') {
    return [];
  }

  const allRecipes = await getAll();

  return allRecipes
    .filter(({ title }) => title.includes(q));
};

module.exports = {
  getAll,
  getById,
  createOne,
  editOne,
  deleteOne,
  searchByTitle,
};
