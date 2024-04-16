const validator = require('validator');

const isValidEmail = async (value) => await validator.isEmail(value);

const isValidUsername = async (value) => {
  const isValidUserName = new RegExp(/^[a-zA-Z_](?!.*?\.{2})[\w.]{3,30}[\w]$/);
  return await value.match(isValidUserName);
};

const isValidName = async (value) => await validator.isAlpha(value);

const isValidLength = async (value, min) =>
  await validator.isLength(value, { min });

const isPasswordStrong = async (value) => {
  return await validator.isStrongPassword(value, {
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    returnScore: false,
  });
};

const isValidPassword = async (value) => {
  let passwordValidity = {
    isStrong: false,
    isLong: false,
  };
  if (await isPasswordStrong(value)) {
    passwordValidity.isStrong = true;
    passwordValidity.isLong = true;
  } else if (!(await isValidLength(value, 6))) {
    passwordValidity.isStrong = false;
    passwordValidity.isLong = false;
  } else if (
    (await isValidLength(value, 6)) &&
    !(await isPasswordStrong(value))
  ) {
    passwordValidity.isStrong = false;
    passwordValidity.isLong = true;
  }
  return passwordValidity;
};

const isValidBirthday = async (value) => (value < 14 ? false : true);

module.exports = {
  isValidEmail,
  isValidUsername,
  isValidName,
  isValidPassword,
  isValidBirthday,
};
