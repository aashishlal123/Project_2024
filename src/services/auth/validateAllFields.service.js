const { validateAllFields } = require('./helpers');

module.exports = async (data) => {
  try {
    let validationResult = await validateAllFields(data);
    return validationResult.errors.length > 0
      ? validationResult
      : { ...validationResult, status: 200 };
  } catch (error) {
    return new Error(error);
  }
};
