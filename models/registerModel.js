const connection = require('./connection');
const userModel = require('./userModel');

async function create({ email, password, firstName, lastName }) {
  return connection().then((db) =>
    db
      .getTable('users')
      .insert(['email', 'password', 'first_name', 'last_name'])
      .values(email, password, firstName, lastName)
      .execute(),
  );
}

function isEmailValid(email = '') {
  const regex = /^(([^<>()\\.,;:\s@']+(\.[^<>()\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
}

function isNameValid(name = '') {
  const regex = /^[a-zA-Z]*$/;
  return name.length > 3 && regex.test(name);
}

function getUserValidade({ email, password, confirm, firstName, lastName } = {}) {
  return {
    email: isEmailValid(email),
    password: password.length >= 6,
    firstName: isNameValid(firstName),
    lastName: isNameValid(lastName),
    confirm: password === confirm,
  };
}

function isUserValid(userValidate) {
  return Object.entries(userValidate).every((value) => value[1]);
}

const userError = {
  email: 'O email deve ter o formato email@mail.com',
  password: 'A senha deve ter pelo menos 6 caracteres',
  firstName: 'O primeiro nome deve ter, no mínimo, 3 caracteres, sendo eles apenas letras',
  lastName: 'O segundo nome deve ter, no mínimo, 3 caracteres, sendo eles apenas letras',
  confirm: 'As senhas tem que ser iguais',
};

function getUserErrors(userValidate) {
  const error = {};
  Object.entries(userValidate).forEach(([field, isValid]) => {
    if (!isValid) {
      error[field] = userError[field];
    } else {
      error[field] = null;
    }
  });
  return error;
}

async function register({ email, password, confirm, firstName, lastName }) {
  try {
    const userValidate = getUserValidade({ email, password, confirm, firstName, lastName });

    const isValid = isUserValid(userValidate);

    const error = getUserErrors(userValidate);

    if (!isValid) return { ok: false, error };

    const userExists = await userModel.findUser({ key: 'email', value: email });

    if (userExists) return { ok: false, error: { ...error, email: 'Email já cadastrado' } };

    await create({
      email,
      password,
      firstName: firstName.toUpperCase(),
      lastName: lastName.toUpperCase(),
    });

    return { ok: true, error };
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  register,
};
