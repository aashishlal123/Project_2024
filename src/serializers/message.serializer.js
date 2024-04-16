const { Serializer } = require('jsonapi-serializer');
let dataToSerialize;

const serializer = async (data, roomId = undefined, offsets = undefined) => {
  try {
    attributes = [
      'userId',
      'roomId',
      'parentId',
      'message',
      'createdAt',
      'Member',
      'messages',
      'messageType',
      'replies',
    ];

    let topLevelLinks = roomId &&
      offsets && {
        previous: () => offsets.previous,
        next: () => offsets.next,
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
