const { Serializer } = require('jsonapi-serializer');
let dataToSerialize;

const serializer = async (data, offsets = undefined) => {
  try {
    attributes = [
      'name',
      'admin',
      'Member',
      'Message',
      'createdAt',
      'updatedAt',
    ];

    let topLevelLinks = offsets && {
      previous: () => `/api/v1/messages/rooms/?page=${offsets.previous}`,
      next: () => `/api/v1/messages/rooms/?page=${offsets.next}`,
    };
    dataToSerialize = new Serializer('message', {
      attributes,
      topLevelLinks,
      keyForAttribute: 'camelCase',
    });
    let serializedData = await dataToSerialize.serialize(data);
    return serializedData;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = serializer;
