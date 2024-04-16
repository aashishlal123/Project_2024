const { registerUser, validateAllFields } = require('./helpers');

module.exports = async (data) => {
  try {
    let validationResult = await validateAllFields(data);

    return validationResult.errors.length > 0
      ? { ...validationResult, status: 200 }
      : await registerUser(data);
  } catch (error) {
    throw new Error(error);
  }
};
