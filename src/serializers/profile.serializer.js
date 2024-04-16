const { Serializer } = require('jsonapi-serializer');
let dataToSerialize;

const profileSerializer = async (data, headerProfile = false) => {
  try {
    headerProfile
      ? (attributes = [
          'userId',
          'userName',
          'fullName',
          'image',
          'email',
          'isActive',
          'profileStatus',
          'childAccount',
          'filterPost',
          'filterOffensiveMessage',
          'birthday',
          'createdAt',
        ])
      : (attributes = [
          'userId',
          'userName',
          'fullName',
          'bio',
          'profileStatus',
          'childAccount',
          'filterPost',
          'filterOffensiveMessage',
          'gender',
          'image',
          'isActive',
          'isCurrentUser',
          'websiteURL',
          'updatedAt',
        ]);

    dataToSerialize = new Serializer('profile', {
      attributes,
      keyForAttribute: 'camelCase',
    });
    let serializedData = await dataToSerialize.serialize(data);
    return serializedData;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = profileSerializer;
