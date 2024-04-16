const { internalServerError } = require('../../utils/errorHandler/APIError');
const { getUserData, loginUser } = require('./helpers');

module.exports = async (emailOrUsername, password) => {
  let user = await getUserData(emailOrUsername);
  try {
    if (user) {
      return await loginUser(password, user);
    } else {
      return {
        status: 401,
        source: 'emailOrUsername',
        title: 'Not Found',
        message: `No user with given email or username found.`,
      };
    }
  } catch (error) {
    throw new Error(error);
  }
};
