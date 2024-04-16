var JSONAPIError = require('jsonapi-serializer').Error;

const errorSerializer = async (errors = []) => {
  if (errors) {
    errors.source = { pointer: errors.source };
    let serialized = new JSONAPIError(errors);
    return serialized;
  }
};

module.exports = errorSerializer;
