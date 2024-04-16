const { Serializer } = require('jsonapi-serializer');
let dataToSerialize;

const serializer = async (data, offsets = undefined) => {
  try {
    attributes = ['hashtag', 'posts'];

    let topLevelLinks = offsets && {
      previous: () => offsets.previous,
      next: () => offsets.next,
    };

    dataToSerialize = new Serializer('hashtags', {
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
