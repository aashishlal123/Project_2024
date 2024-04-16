const { Serializer } = require('jsonapi-serializer');
let dataToSerialize;

const serializer = async (data) => {
  try {
    attributes = ['email', 'userName', 'user_posts'];

    dataToSerialize = new Serializer('user', {
      attributes,
      keyForAttribute: 'camelCase',
    });
    let serializedData = await dataToSerialize.serialize(data);
    return serializedData;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = serializer;
