const { Serializer } = require('jsonapi-serializer');
let dataToSerialize;

const followersSerializer = async (data) => {
  try {
    dataToSerialize = new Serializer('profile', {
      attributes: ['isFollowing', 'userName', 'fullName', 'profile'],
      keyForAttribute: 'camelCase',
    });
    let serializedData = await dataToSerialize.serialize(await data);
    return serializedData;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = followersSerializer;
