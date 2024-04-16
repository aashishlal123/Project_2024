const { Serializer } = require('jsonapi-serializer');
let dataToSerialize;

const serializer = async (data, postId = undefined, offsets = undefined) => {
  try {
    attributes = [
      'parentId',
      'comment',
      'User',
      'createdAt',
      'updatedAt',
      'replies',
    ];

    let topLevelLinks = postId &&
      offsets && {
        previous: () => offsets.previous,
        next: () => offsets.next,
      };
    dataToSerialize = new Serializer('comment', {
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
