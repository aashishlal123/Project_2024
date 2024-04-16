const { Serializer } = require('jsonapi-serializer');
let dataToSerialize;

const followingSerializer = async (data) => {
  try {
    dataToSerialize = new Serializer('profile', {
      attributes: ['isFollowing', 'image', 'User'],
      keyForAttribute: 'camelCase',
    });
    let serializedData = await dataToSerialize.serialize(await data);
    return serializedData;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = followingSerializer;
