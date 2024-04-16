const { validateField } = require('./helpers');

module.exports = async (fieldName, value) => {
  try {
    let serializedMessage = await validateField(fieldName, value);
    return serializedMessage;
  } catch (error) {
    return new Error(error);
  }
};
