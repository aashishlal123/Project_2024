const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { errorSerializer } = require('../../../serializers');
const { genSalt, hash } = require('bcrypt');
const SALT_WORK_FACTOR = 10;
let { getUserData } = require('./general.helpers');

let {
  isValidUsername,
  isValidName,
  isValidEmail,
  isValidPassword,
  isValidBirthday,
} = require('./validation.heplers');

const hashPassword = async (password) => {
  // generate a salt
  return await genSalt(SALT_WORK_FACTOR)
    .then(async (salt) => {
      // hash the password using our new salt
      return await hash(password, salt);
    })
    .catch((error) => {
      throw new Error(error);
    });
};

const generateConformationCode = async () => {
  let conformationCode = crypto.randomInt(100000, 999999);
  return await new Promise(async (myResolve, myReject) => {
    myResolve(conformationCode);
  });
};
/**
 * @param {*} user - The user object contains user username to pass as payload in jwt token
 */
const issueJWT = async (userName) => {
  const payload = {
    sub: userName,
    iat: Date.now(),
  };
  const accessToken = jwt.sign(payload, process.env.AUTH_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.AUTH_ACCESS_TOEKN_LIFETIME,
  });
  return {
    accessToken,
  };
};

const validateField = async (fieldName, value) => {
  let serializedMessage = {};
  if (value === '') {
    serializedMessage = await errorSerializer({
      status: 400,
      source: fieldName,
      title: 'Empty Field',
      detail: `${fieldName} is required`,
    });
  } else {
    if (fieldName === 'userName') {
      if (await getUserData(value, fieldName)) {
        serializedMessage = await errorSerializer({
          status: 400,
          source: fieldName,
          title: 'Dublicate Username',
          detail: 'Username is already in use',
        });
      } else if (await isValidUsername(value)) {
        serializedMessage = {
          status: 200,
          source: fieldName,
          title: 'valid',
        };
      } else {
        serializedMessage = await errorSerializer({
          status: 400,
          source: fieldName,
          title: 'Invalid Username',
          detail: 'Username must be combination of a-z A-z 0-9',
          // 'Username can only contain a-z A-Z 0-9 dot and underline while being within 3-30 characters long and cannot contain only numbers',
        });
      }
    }
    if (fieldName === 'name') {
      if (isValidName(value)) {
        serializedMessage = {
          status: 200,
          source: fieldName,
          title: 'valid',
        };
      } else {
        serializedMessage = await errorSerializer({
          status: 400,
          source: fieldName,
          title: 'Invalid Name',
          detail: 'Name can only contain a-z and A-Z',
        });
      }
    }
    if (fieldName === 'email') {
      let user = await getUserData(value, fieldName);

      if ((await isValidEmail(value)) && !user) {
        serializedMessage = {
          status: 200,
          source: fieldName,
          title: 'valid',
        };
      } else if (user) {
        serializedMessage = await errorSerializer({
          status: 400,
          source: fieldName,
          title: 'Dublicate Email',
          detail: 'Email address is already in use',
        });
      } else {
        serializedMessage = await errorSerializer({
          status: 400,
          source: fieldName,
          title: 'Invalid Email Address',
          detail: 'Email address is invalid',
        });
      }
    }
    if (fieldName === 'password') {
      let { isStrong, isLong } = await isValidPassword(value);

      if (isStrong) {
        serializedMessage = {
          status: 200,
          source: fieldName,
          title: 'valid',
        };
      } else if (!isLong) {
        serializedMessage = await errorSerializer({
          status: 400,
          source: fieldName,
          title: 'Password too short',
          detail: 'Password must be atleast 6 characters long',
        });
      } else if (!isStrong) {
        serializedMessage = await errorSerializer({
          status: 400,
          source: fieldName,
          title: 'Password not strong enough',
          detail: 'Password is not strong enough',
        });
      }
    }
    if (fieldName === 'birthday') {
      if (isValidBirthday(value)) {
        serializedMessage = {
          status: 200,
          source: fieldName,
          title: 'valid',
        };
      } else {
        serializedMessage = await errorSerializer({
          status: 400,
          source: fieldName,
          title: 'Too young to register',
          detail:
            'You must be atleast 14 years old to create a normal account and acoount for children age 8-14 must be registered from parents account',
        });
      }
    }
    if (fieldName == 'bio') {
      if (value.length > 150) {
        serializedMessage = await errorSerializer({
          status: 400,
          source: fieldName,
          title: 'Too Long',
          detail: 'Bio cannot be more than 150 characters',
        });
      } else {
        serializedMessage = {
          status: 200,
          source: fieldName,
          title: 'valid',
        };
      }
    }
    if (fieldName == 'gender') {
      if (value.length > 150) {
        serializedMessage = await errorSerializer({
          status: 400,
          source: fieldName,
          title: 'Too Long',
          detail: 'Gender cannot be more than 150 characters',
        });
      } else {
        serializedMessage = {
          status: 200,
          source: fieldName,
          title: 'valid',
        };
      }
    }
    if (fieldName == 'websiteUrl') {
      if (value.length > 2200) {
        serializedMessage = await errorSerializer({
          status: 400,
          source: fieldName,
          title: 'Too Long',
          detail: 'URL cannot be more than 2200 characters',
        });
      } else {
        serializedMessage = {
          status: 200,
          source: fieldName,
          title: 'valid',
        };
      }
    }
  }
  return serializedMessage;
};

const calculateAge = (birthday) => {
  const diffTime = Math.abs(new Date() - new Date(birthday));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.floor(diffDays / 365);
};

const validateAllFields = async (data) => {
  if (data) {
    let validationResult = { errors: [] };
    let age = calculateAge(data.birthday);
    if (
      (data.parentId && (age < 8 || age > 14)) ||
      (!data.parentId && age < 15)
    ) {
      let errorMessage = await errorSerializer({
        status: 400,
        source: 'birthday',
        title: `${age < 14 ? 'Too young' : 'Too old'} to register`,
        detail:
          'You must be at least 14 to create a normal account and acoount for kids of age 8-14 must be registered from parents account',
      });
      if (errorMessage.errors && errorMessage.errors[0].status === 400) {
        delete errorMessage.errors[0].status;
        validationResult = {
          ...validationResult,
          status: 400,
          errors: [...validationResult.errors, errorMessage.errors[0]],
        };
      }
    }
    let promises = Object.keys(data).map(async (key) => {
      let result = await validateField(key, data[key]);
      if (result.errors && result.errors[0].status === 400) {
        delete result.errors[0].status;
        validationResult = {
          ...validationResult,
          status: 400,
          errors: [...validationResult.errors, result.errors[0]],
        };
      }
    });
    return Promise.all(promises).then(() => {
      return validationResult;
    });
  }
  return new Error('No Data found');
};

module.exports = {
  generateConformationCode,
  issueJWT,
  validateField,
  validateAllFields,
  hashPassword,
};
