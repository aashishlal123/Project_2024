const { Serializer } = require('jsonapi-serializer');
let dataToSerialize;

const serializer = async (data, profileId = undefined, offsets = undefined) => {
  try {
    attributes = [
      'profileId',
      'caption',
      'isChildSafe',
      'updatedAt',
      'image',
      'comment',
      'comments',
      'Comment',
      'User',
      'post',
      'postImage',
      'hashtag',
      'Liked',
      'Profile',
    ];

    let topLevelLinks = offsets && {
      previous: () => offsets.previous,
      next: () => offsets.next,
    };
    dataToSerialize = new Serializer('post', {
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
