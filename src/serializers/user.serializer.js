const { Serializer } = require('jsonapi-serializer');
let dataToSerialize;

const serializer = async (data, include = [], offsets = undefined) => {
  try {
    attributes = [
      'email',
      'fullName',
      'userName',
      'role',
      'status',
      'createdAt',
      'birthday',
      'parentId',
      ...include,
    ];

    let topLevelLinks = offsets && {
      previous: () => offsets.previous,
      next: () => offsets.next,
    };

    dataToSerialize = new Serializer('user', {
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
